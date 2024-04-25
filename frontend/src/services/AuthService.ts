import { Service } from "./Service";

export class AuthService extends Service {
  protected url = "http://localhost:5042/account/login";
}