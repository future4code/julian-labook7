import { Request, Response } from "express";
import UserBusiness from "../Business/UserBusiness";
import UserDatabase, { User } from "../data/UserDatabase";
import IdGenerator from "../services/IdGen.class";
import Authenticator from "../services/Authenticator.class";
import HashManager from "../services/HashManager.class";
import RefreshTokenDatabase, {
  RefreshTokenData,
} from "../data/RefreshTokenDatabase";

export class UserController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const userBusiness: UserBusiness = new UserBusiness();
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.device) {
        throw new Error("Invalid input");
      }
      if (req.body.email.indexOf("@") === -1) {
        throw new Error("Invad email address");
      }
      if (req.body.password.lenght < 6) {
        throw new Error("Invalid password lenght");
      }
      console.log("Validations passed")
      const idGenerator = new IdGenerator();

      const id = idGenerator.generateId();
      const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        device: req.body.device,
      };
      console.log('userData: ', userData);

      const hashManager = new HashManager();
      const hashPassword = await hashManager.hash(userData.password);

      const user: User = {
        id: id,
        name: userData.name,
        email: userData.email,
        password: hashPassword,
      };
      console.log('user: ', user)
      await userBusiness.signup(user);

      const authenticator = new Authenticator();
      const accessToken = authenticator.generateToken({ id }, "10min");
      console.log("accessToken: ", accessToken)
      const refreshToken = authenticator.generateToken(
        { id, device: userData.device },
        "2y"
      );
        console.log("refreshToken: ", refreshToken);

      const refreshTokenDB = new RefreshTokenDatabase();

      const refreshTokenData: RefreshTokenData = {
        token: refreshToken,
        device: req.body.device,
        userId: id,
        isActive: true,
      }
      console.log('refreshTokenData: ', refreshTokenData)
      await refreshTokenDB.create(refreshTokenData);

      res
        .status(200)
        .send({ access_token: accessToken, resfresh_token: refreshToken });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const userBusiness: UserBusiness = new UserBusiness();

      if (
        !req.body.email ||
        req.body.email.indexOf("@") === -1 ||
        !req.body.password ||
        req.body.password.lenght < 6
      ) {
        throw new Error("Invalid credentials");
      }

      const user = await userBusiness.getByEmail(req.body.email);

      const userData = {
        email: req.body.email,
        password: req.body.password,
        device: req.body.device,
      };

      const hashManager = new HashManager();
      const correctPassword = await hashManager.compare(
        userData.password,
        user.password
      );

      if (!correctPassword) {
        throw new Error("Invalid password");
      }

      const authenticator = new Authenticator();
      const accessToken = authenticator.generateToken({ id: user.id });
      const refreshToken = authenticator.generateToken(
        { id: user.id, device: userData.device },
        "2y"
      );

      const refreshTokenDB = new RefreshTokenDatabase();

      const refreshTokenFromDB = await refreshTokenDB.getByIdAndDevice(
        user.id,
        userData.device
      );

      if (refreshTokenFromDB) {
        console.log("refreshTokenFromDB: ", refreshTokenFromDB);
        await refreshTokenDB.delete(refreshTokenFromDB.token);
      }

      const refreshTokenData: RefreshTokenData = {
        token: refreshToken,
        device: req.body.device,
        userId: user.id,
        isActive: true,
      }

      console.log("refreshTokenData: ", refreshTokenData)
      await refreshTokenDB.create(refreshTokenData);

      res
        .status(200)
        .send({ access_token: accessToken, resfresh_token: refreshToken });
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
  }

  async getNewAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken;
      const device = req.body.device;

      const authenticator = new Authenticator();
      const refreshTokenData = authenticator.getData(refreshToken);
      if (refreshTokenData.device !== device) {
        throw new Error("Refresh token das no device");
      }

      const userDB = new UserDatabase();
      const user = await userDB.getById(refreshTokenData.id);

      const accessToken = authenticator.generateToken({ id: user.id });

      res.status(200).send({ access_token: accessToken });
    } catch (err) {
       res.status(400).send({
        message: err.message,
      });
    }
  }

  async makeFriends(req: Request, res: Response): Promise<void> {
    try{
      if (!req.body.userToMakeFriend || req.body.userToMakeFriend === " ") {
        throw new Error("Insira um id");
      }
      const token = req.headers.token as string;
      
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const follower_id = authenticationData.id;
      const followed_id = req.body.userToMakeFriend
  
      const newFriendId = new UserDatabase();
      const newIdDb = await newFriendId.isValidIdMake(followed_id);
  
      if (newIdDb.quantity === 0) {
        throw new Error("Insira um id válido");
      }

      const friendId = new UserDatabase();
      const idDb = await friendId.isFriends(followed_id, follower_id);
  
      if (idDb.quantity !== 0) {
        throw new Error("Olha só, vocês já são amigos!");
      }
      
      const userDb = new UserDatabase();   
      await userDb.createFriend(followed_id, follower_id);
      await userDb.createFriend(follower_id, followed_id);    
  
      res.status(200).send({
        mensagem: "Parabéns, você tem um novo amigo!"
      });

    }catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
  }

  async undoFriends(req: Request, res: Response): Promise<void> {
    try{
      if (!req.body.userToUndoFriend || req.body.userToUndoFriend === " ") {
        throw new Error("Insira um id");
      }
      
      const token = req.headers.token as string;
      
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const follower_id = authenticationData.id;
      const followed_id = req.body.userToUndoFriend
  
      const oldFriendId = new UserDatabase();
      const oldIdDb = await oldFriendId.isValidIdUndo(followed_id);
      
      if (oldIdDb.quantity === 0) {
        throw new Error("Insira um id válido");
      }

      const friendId = new UserDatabase();
      const idDb = await friendId.isFriends(followed_id, follower_id);
  
      if (idDb.quantity === 0) {
        throw new Error("Mas vocês nem amigos eram!");
      }

      const userDb = new UserDatabase();   
      await userDb.dissolveFriend(followed_id, follower_id);
      await userDb.dissolveFriend(follower_id, followed_id);
  
      res.status(200).send({
        mensagem: "Amizade desfeita, que pena!"
      });
    }catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
  }  
}
