import knex from "knex";
import BaseDatabase from "../model/BaseDatabase";
import { PostDTO } from "../model/PostDTO";

export default class PostDatabase extends BaseDatabase {

  private static TABLE_NAME: string = "LbkPost";

  public async createNewPost(postDTO: PostDTO): Promise<void> {
    
    await this.getConnection().raw(
      `
      INSERT INTO ${PostDatabase.TABLE_NAME}(id, picture, description, creator_id, date)
      VALUES ("${postDTO.id}", "${postDTO.picture}", "${postDTO.description}", "${postDTO.creator_id}", CURDATE());
      `
    );
    BaseDatabase.destroyConnection();
  }
}
