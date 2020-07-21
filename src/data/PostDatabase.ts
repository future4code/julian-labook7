import knex from "knex";
import BaseDatabase from "./BaseDatabase";

export interface Post {
  creator_id: string;
  picture: string;
  description: string;
  date: string;
}

export default class PostDatabase extends BaseDatabase {

  private static TABLE_NAME: string = "LbkPost";

  public async createNewPost(post: Post): Promise<void> {
    await this.getConnection()
      .insert({
        creator_id: post.creator_id,
        picture: post.picture,
        description: post.description,
        date: post.date
      })
      .into(PostDatabase.TABLE_NAME);
  }
}