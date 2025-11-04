export type Role = 'Developer' | 'Designer' | 'Manager' | string;

export interface Row {
  id: string;
  name: string;
  email: string;
  age: number | string;
  role: Role;
  [key: string]: any; 
}

export interface ColumnConfig {
  label: string;
  visible: boolean;
  fixed?: boolean;
}
