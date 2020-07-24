import UserDatabase from "../data/UserDatabase";
import { UserSignupDTO } from "../model/UserDTO"
export default class UserBusiness{
    private userDatabase = new UserDatabase();

    public async signup(user: UserSignupDTO){

        await this.userDatabase.signup(user);
    }

    public async getByEmail(email: string): Promise<any>{
        
        const result = await this.userDatabase.getByEmail(email);
        return result;
    }

    public async getById(id: string){

        return await this.userDatabase.getById(id);
    }
}