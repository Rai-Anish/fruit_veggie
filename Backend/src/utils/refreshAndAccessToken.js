import User from "../models/user.model.js";

export const genrateAccessAndRefreshToken = async (id) => {
  try {
    const userExist = await User.findById(id);

    if (!userExist) {
      throw new ApiError(404, "User doesn't exist");
    }

    const accessToken = userExist.generateAccessToken();
    const refreshToken = userExist.generateRefreshToken();

    userExist.refreshToken = refreshToken;
    await userExist.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Couldn't create access and refresh token");
  }
};
