import type { CookieOptions } from "express";

export function sessionCookieOptions(secure: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    secure,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  };
}
