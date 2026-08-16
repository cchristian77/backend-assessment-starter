import { HTTPStatusCode } from "../utility/status.code";

export class SuccessResponse {
  status: number;
  message: string;
  data: any;

  constructor(data: any, status: number = HTTPStatusCode.OK, message = "Success") {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponse extends Error {
  status: number;
  message: string;
  errors: any;

  constructor(status: number, message: string, errors?: any) {
    super();
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export default { Success: SuccessResponse, Error: ErrorResponse };
