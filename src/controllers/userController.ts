import { NextFunction, Request, RequestHandler, Response } from "express";
import UserModel from "../models/userModel";
import {
  userValidationSchema,
  loginValidationSchema,
} from "../utils/validations/userValidations";
import accessToken from "../config/jwtToken";
const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userName, email, password } = req.body;

  const { error } = userValidationSchema.validate({
    userName,
    email,
    password,
  });

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new UserModel({ userName, email, password });
    await newUser.save();

    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { emailOrUsername, password } = req.body;
    const { error } = loginValidationSchema.validate({
      emailOrUsername,
      password,
    });

    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const findUser = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
    });
    if (!findUser) {
      res.status(400).json({ message: "This email does not exist" });
      return;
    }
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const accesToken = await accessToken(findUser?._id);
      const updateUser = await UserModel.findByIdAndUpdate(
        findUser.id,
        {
          token: accesToken,
        },
        { new: true }
      );
      res.json(updateUser);
      return;
    }
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
    return;
  }
};

export { loginUser, registerUser };
