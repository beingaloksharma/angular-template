export type UserRole = 'user' | 'admin' | 'superadmin';

export interface DecodedToken {
  authorized: boolean;
  id: number;
  email: string;
  name: string;
  user_name: string;
  schema_name: string;
  role: UserRole | string;
  tenant_id: number;
  created_at: string;
  exp: number;
}

export interface UserListItem {
  id: number;
  tenant_id: number;
  name: string;
  user_name: string;
  email: string;
  moblie: string;
  role: string;
  status: string;
  schema_name: string;
  created_at: string;
  created_by?: string;
}

export interface TenantWithUsers {
  tenant_id: number;
  name: string;
  user_name: string;
  email: string;
  moblie: string;
  schema_name: string;
  status: string;
  created_at: string;
  users: UserListItem[];
}

export interface RoleItem {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at?: string;
  created_by?: string;
}

export interface RoleMappingItem {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
  role_name: string;
  status: string;
}

export interface EndpointRoleItem {
  id: number;
  endpoint: string;
  method: string;
  role: string;
  status: string;
}

export interface CreateTenantUserDTO {
  name: string;
  user_name: string;
  email: string;
  moblie: string;
  password?: string;
  role: string;
}

export interface CreateWorkspaceDTO {
  name: string;
  user_name: string;
  email: string;
  moblie: string;
  password: string;
}
