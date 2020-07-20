import knex from "knex";
import BaseDB from "./BaseDB.class";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default class UserDB extends BaseDB {

}
