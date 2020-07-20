import UserDatabase, { User } from "../data/UserDatabase";

export default class UserBusiness{
    private userDatabase = new UserDatabase();

    public async signup(user: User){
        //viriam as validações de negócio.
        await this.userDatabase.signup(user);
    }

    public async getByEmail(email: string): Promise<any>{
        const result = await this.userDatabase.getByEmail(email);
        return result;
    }
    // // public async approve(id: string){
    // //     await this.userDatabase.approve(id);
    // // }

    // // public async getUserById(id: string){
    // //     //return pois é um select
    // //    return await this.userDatabase.getUserById(id);
    // }
}