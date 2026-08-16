// CODE REVIEW #9: Input Validation
import Errors from "../../utility/errors";

export class CreateNoteRequest {
  private constructor(
    public readonly title: string,
    public readonly body: string
  ) {
    this.validate();
  }

  public validate(): void {
    const errors: { fields: string[]; constraint: string }[] = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push({ fields: ["title"], constraint: "Title is required" });
    }

    if (!this.body || this.body.trim().length === 0) {
      errors.push({ fields: ["body"], constraint: "Body is required" });
    }

    if (errors.length > 0) {
      throw new Errors.BadRequestError("Input validation error.", errors);
    }
  }

  public static create(object: Record<string, unknown>): CreateNoteRequest {
    const { title, body } = object;
    return new CreateNoteRequest(title as string, body as string);
  }
}
