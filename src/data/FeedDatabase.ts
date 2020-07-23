import knex from "knex";
import BaseDatabase from "./BaseDatabase";

export default class FeedDatabase extends BaseDatabase {

    public getFeed = async(userId: string) : Promise <any> => {
         
        const result = await this.getConnection()
            .raw(`SELECT LbkPost.id, description, picture, 
                  date, creator_id, LbkUser.id, LbkUser.name
                  FROM LbkPost
                  JOIN LbkUsersRelation
                  ON LbkUsersRelation.followed_id = LbkPost.creator_id
                  AND LbkUsersRelation.follower_id = '${userId}'
                  JOIN LbkUser
                  ON LbkPost.creator_id = LbkUser.id;`)
            return result[0]; 
    }
}
