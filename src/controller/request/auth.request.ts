// CODE REVIEW #9: Input Validation
import Errors from "../../utility/errors";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export class LoginRequest {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {
    this.validate();
  }

  public validate(): void {
    const errors: { fields: string[]; constraint: string }[] = [];

    if (!this.email || !REGEX_EMAIL.test(this.email)) {
      errors.push({ fields: ["email"], constraint: "Email is not valid" });
    }

    if (!this.password || this.password.length < MIN_PASSWORD_LENGTH) {
      errors.push({ fields: ["password"], constraint: "Password is not valid" });
    }

    if (errors.length > 0) {
      throw new Errors.BadRequestError("Bad Request. Error : Input validation error.", errors);
    }
  }

  public static create(object: Record<string, unknown>): LoginRequest {
    const { email, password } = object;
    return new LoginRequest(email as string, password as string);
  }
}
