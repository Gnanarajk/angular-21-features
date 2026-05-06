import { Product } from '../../products/model/product.model';

export interface Order {
  id: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  total: number;
  discountedTotal: number;
  products: Product[];
  role: string; // Added role property to Order model
}
