import knex from 'knex';
import knexfile from '../knexfile';

const db = knex(knexfile.development);

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  status: 'active' | 'deactive';
  role_id: number;
  created_at?: Date;
}

export class UserRepository {
  static async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const [user] = await db('users').insert(userData).returning('*');
    return user;
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return await db('users').where('email', email).first();
  }

  static async findById(id: number): Promise<User | undefined> {
    return await db('users').where('id', id).first();
  }

  static async getRoleByName(roleName: string): Promise<{ id: number; name: string } | undefined> {
    return await db('roles').where('name', roleName).first();
  }

  static async getRoleById(roleId: number): Promise<{ id: number; name: string } | undefined> {
    return await db('roles').where('id', roleId).first();
  }
} 