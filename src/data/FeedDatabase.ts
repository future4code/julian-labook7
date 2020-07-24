import knex from "knex";
import BaseDatabase from "../model/BaseDatabase";
import { UserIdDTO } from "../model/UserDTO";

export default class FeedDatabase extends BaseDatabase {

    public getFeed = async(userIdDTO: UserIdDTO) : Promise <any> => {
         
        const result = await this.getConnection()
            .raw(`SELECT LbkPost.id, description, picture, 
                  date, creator_id, LbkUser.id, LbkUser.name
                  FROM LbkPost
                  JOIN LbkUsersRelation
                  ON LbkUsersRelation.followed_id = LbkPost.creator_id
                  AND LbkUsersRelation.follower_id = '${userIdDTO.id}'
                  JOIN LbkUser
                  ON LbkPost.creator_id = LbkUser.id;`)
            return result[0]; 
    }


    public getSinglePost = async(userId: string, postId: string): Promise<any> => {
        const result = await this.getConnection()
            .raw(`SELECT LbkPost.id, description, picture, date, LbkUser.name
                  FROM LbkPost
                  JOIN LbkUsersRelation
                  ON LbkUsersRelation.followed_id = LbkPost.creator_id
                  AND LbkUsersRelation.follower_id = '${userId}'
                  JOIN LbkUser
                  ON LbkPost.creator_id = LbkUser.id
                  WHERE LbkPost.id = '${postId}';`)
            return result[0];
    }
}
