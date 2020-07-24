import BaseDatabase from "./BaseDatabase";

export interface RefreshTokenData {
    token: string,
    device: string,
    isActive: boolean,
    userId: string
}

export default class RefreshTokenDatabase extends BaseDatabase {
    private static TABLE_NAME = "LbkRefreshToken";

    public create = async(data: RefreshTokenData): Promise<void> => {

        console.log('started creating');
        await this.getConnection().raw(`
        INSERT INTO ${RefreshTokenDatabase.TABLE_NAME}(refresh_token, device, is_active, user_id)
        VALUES ("${data.token}", "${data.device}", ${Number(data.isActive)}, "${data.userId}")
        `)
        console.log('ended')
        await BaseDatabase.destroyConnection();

    }
    public getData = async(token: string): Promise<RefreshTokenData> => {
        const result = await this.getConnection().raw(`
        SELECT *
        FROM ${RefreshTokenDatabase.TABLE_NAME}
        WHERE refresh_token = "${token}"
        `)

        const retrievedToken = result[0][0];

        await BaseDatabase.destroyConnection();

        return {
            token: retrievedToken.refresh_token,
            device: retrievedToken.device,
            isActive: Boolean(retrievedToken.is_active),
            userId: retrievedToken.user_id
        }
    }

    public getByIdAndDevice = async(id: string, device: string): Promise<RefreshTokenData | undefined> => {
        const result = await this.getConnection().raw(`
        SELECT *
        FROM ${RefreshTokenDatabase.TABLE_NAME}
        WHERE user_id = "${id}" 
        AND device = "${device}"
        `)

        const retrievedToken = result[0][0];

        await BaseDatabase.destroyConnection();

        if(retrievedToken === undefined){
            return undefined;
        }

        return {
            token: retrievedToken.refresh_token,
            device: retrievedToken.device,
            isActive: Boolean(retrievedToken.is_active),
            userId: retrievedToken.user_id
        }
    }

    public delete = async(token: string): Promise<void> => {

        await this.getConnection().raw(`
        DELETE
        FROM ${RefreshTokenDatabase.TABLE_NAME}
        WHERE refresh_token = "${token}"
        `);

        await BaseDatabase.destroyConnection();
    }
}