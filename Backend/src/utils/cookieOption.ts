export const refreshAndAccessCookieOption = () => {
  const refreshOption = {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const accessOption = {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 15, // 15 min
  };

  return { refreshOption, accessOption };
};
