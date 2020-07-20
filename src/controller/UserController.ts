import { Request, Response } from "express";
import UserBusiness from "../Business/UserBusiness";
import UserDatabase, { User } from "../data/UserDatabase";
import IdGenerator from "../services/IdGen.class";
import Authenticator from "../services/Authenticator.class";
import HashManager from "../services/HashManager.class";

export class UserController {

    async signup(req: Request, res: Response): Promise<void> {
        const userBusiness: UserBusiness = new UserBusiness();
        try {

            if (!req.body.name || !req.body.email || !req.body.password) {
                throw new Error("Invalid input");
              }
              if (req.body.email.indexOf("@") === -1) {
                throw new Error("Invad email address");
              }
              if (req.body.password.lenght < 6) {
                throw new Error("Invalid password lenght");
              }

            const idGenerator = new IdGenerator();

            const id = idGenerator.generateId();
            const name = req.body.name;
            const email = req.body.email;

            const hashManager = new HashManager();
            const password = req.body.password;
            const hashPassword = await hashManager.hash(password);

            const user: User = {
                id,
                name,
                email,
                password: hashPassword
            }

            await userBusiness.signup(user);

            const authenticator = new Authenticator();
            const access_token = authenticator.generateToken({ id });

            res.status(200).send({ message: "Usuário criado e logado com sucesso!", access_token });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }

    };

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
      
          const data = {
            email: req.body.email,
            password: req.body.password
          };
      
          const hashManager = new HashManager();
          const correctPassword = await hashManager.compare(
            data.password,
            user.password
          );
      
          if (!correctPassword) {
            throw new Error("Invalid password");
          }
      
          const authenticator = new Authenticator();
          const access_token = authenticator.generateToken({ id: user.id });
      
          res.status(200).send({ message: "Usuário logado com sucesso!", access_token });
        } catch (err) {
          res.status(400).send({
            message: err.message,
          });
        }
      }
}