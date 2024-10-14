import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/user-service";
import {
  loginValidationSchema,
  userValidationSchema,
} from "../validations/user-validations";

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
    const newUser = await registerUserService(userName, email, password);

    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
    return;
  } catch (error: any) {
    if (error.message === "User already exists") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
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

    const updatedUser = await loginUserService(emailOrUsername, password);
    res.json(updatedUser);
    return;
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ message: "This email/username does not exist" });
    } else if (error.message === "Invalid credentials") {
      res.status(400).json({ message: "Invalid credentials" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
    return;
  }
};

export { loginUser, registerUser };

