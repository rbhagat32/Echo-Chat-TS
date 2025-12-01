interface CookieOptionsTypes {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "strict" | "lax";
  expires: Date;
}

export const cookieOptions: CookieOptionsTypes = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
};
