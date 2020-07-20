import { Request, Response } from "express";
import UserBusiness from "../Business/UserBusiness";
import { User } from "../data/UserDatabase";
import IdGenerator from "../services/IdGen.class";
import Authenticator from "../services/Authenticator.class";
import HashManager from "../services/HashManager.class";

export class UserController {

    async signup(req: Request, res: Response) {
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
            const token = authenticator.generateToken({ id });

            res.status(200).send({ message: "Usuário criado e logado com sucesso!", token: token });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }

    }
}