import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: { fname: string; lname: string; role: string };
  }
}
