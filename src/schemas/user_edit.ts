import * as Yup from "yup";

export const UserEditSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string().when("password", ([password], schema) => {
    return password
      ? schema
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm your password")
      : schema;
  }),
});
