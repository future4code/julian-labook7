import { Request, Response } from "express";
import PostDatabase, { Post } from "../data/PostDatabase";
import Authenticator from "../services/Authenticator.class";

export class PostController {
    async createNewPost(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.token as string;
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);
            const creator_id = authenticationData.id;
            const picture = req.body.picture;
            const description = req.body.description;
            const date = req.body.date

            const post: Post = {
                creator_id,
                picture,
                description,
                date
              }
                  
            const postDatabase = new PostDatabase();
            await postDatabase.createNewPost(post);
            
      
            res.status(200).send({
                message: "Seu post foi criado com sucesso!"
            });
        } catch (err) {
            res.status(400).send({
            message: err.message,
          });
        }      
    };
}
//O post deve ser criado, passando-se as informações de: foto, descrição, 
//data de criação e tipo ("normal" ou "evento").
