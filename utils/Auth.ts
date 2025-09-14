import jwt from "jsonwebtoken";

export class Auth {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "TH3SN3AKYK3Y";
  }

  public generateToken() {
    return jwt.sign("BASIC AUTH", this.secret);
  }

  public validateToken(token: string) {
    if (!token) {
      return { message: "Token not provided", success: false };
    }

    try {
      jwt.verify(token, this.secret);
      return { message: "Token validated", success: true };
    } catch (err: any) {
      return { message: err.message, success: false, error: err };
    }
  }
}
