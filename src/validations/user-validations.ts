import Joi from "joi";

const userValidationSchema = Joi.object({
  userName: Joi.string().min(4).max(9).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginValidationSchema = Joi.object({
  emailOrUsername: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export { userValidationSchema, loginValidationSchema };
