import { Role } from './Role';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}
