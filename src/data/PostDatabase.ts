import knex from "knex";
import BaseDatabase from "./BaseDatabase";

export interface Post {
  creator_id: string;
  picture: string;
  description: string;
  id: string;
  
}

export default class PostDatabase extends BaseDatabase {

  private static TABLE_NAME: string = "LbkPost";

  public async createNewPost(post: Post): Promise<void> {
    
    await this.getConnection().raw(
      `
      INSERT INTO ${PostDatabase.TABLE_NAME}(id, picture, description, creator_id, date)
      VALUES ("${post.id}", "${post.picture}", "${post.description}", "${post.creator_id}", CURDATE());
      `
    );
    BaseDatabase.destroyConnection();
  }
}
