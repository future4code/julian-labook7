import { Request, Response} from  'express';
import FeedDatabase from '../data/FeedDatabase';
import Authenticator from '../services/Authenticator.class';

export class FeedController {
    async getFeed(req: Request, res: Response): Promise<any>{
        try{
                 const token = req.headers.authorization as string;
                 const authenticator = new Authenticator();
                 const authenticationData = authenticator.getData(token);
                 const userId = authenticationData.id;

                 console.log(userId);
                 
                 if (!userId){
                     res.status(400).send({message: 'Insira um ID no hearders > token.'})
                 }

                  const feedDatabase = new FeedDatabase();
                  const feed = await feedDatabase.getFeed(userId);

                  res.status(200).send(feed);

        }catch (error) {
                res.status(400).send({message: error.message});
              }
    }
}
