import knex from "knex";
import BaseDatabase from "./BaseDatabase";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default class UserDatabase extends BaseDatabase {

}
