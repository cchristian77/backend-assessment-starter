// CODE REVIEW #9: Input Validation
import Errors from "../../utility/errors";

export class RegisterRequest {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {
    this.validate();
  }

  public validate(): void {
    const errors: { fields: string[]; constraint: string }[] = [];

    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !REGEX_EMAIL.test(this.email)) {
      errors.push({ fields: ["email"], constraint: "Email is not valid" });
    }

    const MIN_PASSWORD_LENGTH = 6;
    if (!this.password || this.password.length < MIN_PASSWORD_LENGTH) {
      errors.push({ fields: ["password"], constraint: "Password is not valid. Password must at least 6 characters." });
    }

    if (errors.length > 0) {
      throw new Errors.BadRequestError("Error validating user data", errors);
    }
  }

  public static create(object: Record<string, unknown>): RegisterRequest {
    const { email, password } = object;
    return new RegisterRequest(email as string, password as string);
  }
}
