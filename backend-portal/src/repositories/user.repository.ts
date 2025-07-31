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
    const [insertedId] = await db('users').insert(userData);
    const user = await db('users').where('id', insertedId).first();
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

  static async getAllUsers(): Promise<User[]> {
    return await db('users').select('*');
  }

  static async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | undefined> {
    await db('users').where('id', id).update(updates);
    return await db('users').where('id', id).first();
  }

  static async deleteUser(id: number): Promise<number> {
    return await db('users').where('id', id).del();
  }

  static async getUserById(id: string): Promise<User | undefined> {
    return await db('users').where('id', id).first();
  }
}