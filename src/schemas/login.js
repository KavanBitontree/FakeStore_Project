import * as Yup from "yup";
import { REGEX } from "../utils/regex";

export const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      REGEX.PASSWORD,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
});
