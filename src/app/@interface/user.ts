export interface User {
  email: string;
  name: string;
  phone: string;
  password?: string;
  age: number|string;
  role?: string; // 'admin' 或 'user'
}

export interface UpdatePassword{
  email: string;
  password: string;
  newPassword: string; // 用於修改密碼時的新密碼
}
