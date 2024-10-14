import UserModel from "../models/UserModel";
import accessToken from "../utils/generate-jwt-token";

const registerUserService = async (
  userName: string,
  email: string,
  password: string
) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const newUser = new UserModel({
    userName,
    email,
    password,
  });

  await newUser.save();
  return newUser;
};

const loginUserService = async (emailOrUsername: string, password: string) => {
  const findUser = await UserModel.findOne({
    $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
  });
  if (!findUser) {
    throw new Error("User not found");
  }
  const isPasswordMatched = await findUser.isPasswordMatched(password);
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }
  const token = await accessToken(findUser?._id);
  const updatedUser = await UserModel.findByIdAndUpdate(
    findUser._id,
    { token },
    { new: true }
  );
  return updatedUser;
};

export { loginUserService, registerUserService };

