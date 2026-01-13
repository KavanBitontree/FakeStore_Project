import * as Yup from "yup";

export const ProductSchema = Yup.object({
  title: Yup.string().required("Title is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),

  description: Yup.string()
    .min(10, "Description too short")
    .required("Description is required"),

  category: Yup.string(), // optional here
  newCategory: Yup.string(), // optional here

  image: Yup.string()
    .url("Enter a valid image URL")
    .required("Image URL is required"),
});
