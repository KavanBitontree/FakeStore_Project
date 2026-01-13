import { Product } from "./product";
type CartItem = Product & {
  quantity: number;
  newCategory?: string;
};

export { CartItem };
