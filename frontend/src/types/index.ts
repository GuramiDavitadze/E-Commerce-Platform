// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
  image: string | null;
  isActive: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  quantity: number;
  status: ProductStatus;
  admin_id: string;
  category_id: string;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: Product[];
  limit: number;
  total: number;
  skip: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  content: string;
  category_slug: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product_id: string;
  product?: Product;
}

export interface Order {
  id: string;
  status: OrderStatus;
  user_id: string;
  user?: User;
  items: OrderItem[];
  created_at: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface CreateOrderPayload {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  text: string;
  rating: number;
  author_id: string;
  author?: User;
  product_id: string;
  created_at: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
}

export interface CreateCommentPayload {
  text: string;
  rating: number;
  product_id: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  skip?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

// ─── Cart (client-side only) ──────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}
