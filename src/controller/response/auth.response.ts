export class LoginResponse {
  access_token: string;
  token_type: string;
  expires_at: number;

  constructor(accessToken: string, expiresAt: number, tokenType: string = "Bearer") {
    this.access_token = accessToken;
    this.token_type = tokenType;
    this.expires_at = expiresAt;
  }
}
