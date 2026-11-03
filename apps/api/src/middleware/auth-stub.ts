import { Request, Response, NextFunction } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  currency: string;
  locale: string;
  timezone: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Development-only stub returning the seeded demo user
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export function devAuthStub(req: Request, _res: Response, next: NextFunction): void {
  req.user = {
    id: DEMO_USER_ID,
    email: "demo@masrouf.test",
    name: "Amira Ben Salah",
    currency: "TND",
    locale: "fr-TN",
    timezone: "Africa/Tunis",
  };
  next();
}
