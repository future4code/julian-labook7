import * as jwt from "jsonwebtoken";

interface AuthenticationData {
  id: string;
  device?: string;
}
export default class Authenticator {
  private static EXPIRES_IN = "10min";

  public generateToken = (input: AuthenticationData, expiresIn: string = Authenticator.EXPIRES_IN): string => {
    const token = jwt.sign(
      {
        id: input.id,
        device: input.device
      },
      process.env.JWT_KEY as string,
      {
        expiresIn,
      }
    );

    return token;
  };

  public getData = (token: string): AuthenticationData => {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    const result = {
      id: payload.id
      };
    return result;
  }
}