import knex from "knex";
import BaseDatabase from "../model/BaseDatabase";
import { UserSignupDTO } from "../model/UserDTO"

export default class UserDatabase extends BaseDatabase {
  private static TABLE_NAME: string = "LbkUser";
  private static COLUMN_NAME_USER: string = "id"
  private static TABLE_NAME_FRIENDS: string = "LbkUsersRelation";
  private static COLUMN_NAME_FOLLOWED: string = "followed_id";
  private static COLUMN_NAME_FOLLOWER: string = "follower_id"

  public signup = async (user: UserSignupDTO): Promise<void> => {
    await this.getConnection()
      .insert({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .into(UserDatabase.TABLE_NAME);

  };

  public getByEmail = async (email: string): Promise<any> => {
    const result = await this.getConnection().raw(
      `
      SELECT *
      FROM ${UserDatabase.TABLE_NAME}
      WHERE email = "${email}";
      `
    );

    return result[0][0];
  };

  public getById = async (id: string): Promise<any> => {
    const result = await this.getConnection().raw(
      `
      SELECT *
      FROM ${UserDatabase.TABLE_NAME}
      WHERE id = "${id}";
      `
    );

    return result[0][0];
  };
  public async createFriend(followed_id: string, follower_id: string): Promise<void> {
    await this.getConnection()
      .insert({ followed_id, follower_id })
      .into(UserDatabase.TABLE_NAME_FRIENDS);
  }

  public async isValidIdMake(id: string): Promise<any> {
    const result = await this.getConnection() 
      .raw(`
        SELECT COUNT(*) as quantity FROM ${UserDatabase.TABLE_NAME}
        WHERE ${UserDatabase.COLUMN_NAME_USER}="${id}"`
      );
    return result[0][0]
  }

  public async isFriends(followed_id: string, follower_id: string): Promise<any> {
    const result = await this.getConnection() 
      .raw(`
        SELECT COUNT(*) as quantity FROM ${UserDatabase.TABLE_NAME_FRIENDS}
        WHERE ${UserDatabase.COLUMN_NAME_FOLLOWED}="${followed_id}" AND ${UserDatabase.COLUMN_NAME_FOLLOWER}="${follower_id}"`
      );
    return result[0][0]
  }

  public async dissolveFriend(followed_id: string, follower_id: string): Promise<any> {
    try{
      await this.getConnection()
      .delete()
      .from(UserDatabase.TABLE_NAME_FRIENDS)
      .where({ followed_id, follower_id });
    }catch(err){
      throw new Error(err.sqlMessage || err.message)
    }
  }

  public async isValidIdUndo(id: string): Promise<any> {
    const result = await this.getConnection() 
      .raw(`
        SELECT COUNT(*) as quantity FROM ${UserDatabase.TABLE_NAME_FRIENDS}
        WHERE ${UserDatabase.COLUMN_NAME_FOLLOWED}="${id}"`
      );
    return result[0][0]
  }
}
