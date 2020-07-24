import { Request, Response } from "express";
import PostDatabase from "../data/PostDatabase";
import Authenticator from "../services/Authenticator.class";
import IdGenerator from "../services/IdGen.class";
import { PostDTO } from "../model/PostDTO";

export class PostController {
    async createNewPost(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.token as string;
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);
            const creator_id = authenticationData.id;
            const picture = req.body.picture;
            const description = req.body.description;
            const idGenerator = new IdGenerator();            

            const postDTO: PostDTO = {
                creator_id,
                picture,
                description,
                id: idGenerator.generateId()                
              }
                  
            const postDatabase = new PostDatabase();
            await postDatabase.createNewPost(postDTO);
            
      
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

