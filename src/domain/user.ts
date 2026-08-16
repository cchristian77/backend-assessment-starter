// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
export type UserProps = {
  id: number;
  email: string;
  password: string;
};

export class User {
  id: number;
  email: string;
  password: string;

  constructor(data: UserProps) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
  }
}
