import knex from "knex";
import BaseDatabase from "./BaseDatabase";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default class UserDatabase extends BaseDatabase {
  private static TABLE_NAME: string = "LbkUser";

  public signup = async (user: User): Promise<void> => {
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
}
