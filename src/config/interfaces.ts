export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  isPasswordMatched: (enteredPassword: string) => Promise<boolean>;
}
