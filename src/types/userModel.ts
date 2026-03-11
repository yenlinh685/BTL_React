export interface UserModel {
  id: number;
  name: string;
  email: string;
  password: string;
  full_name: string;
  nickname: string;
  avatar: string;
  phone_number: string;
  role: "customer" | "admin" | "agent";
  address: string;
  created_at: string;
  updated_at: string;
}
