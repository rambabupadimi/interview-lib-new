import knex from 'knex';
import knexfile from '../knexfile';

const db = knex(knexfile.development);

export interface Technology {
  id?: number;
  name: string;
  created_by: number;
  created_at?: Date;
}

export class TechnologyRepository {
  static async createTechnology(technologyData: Omit<Technology, 'id' | 'created_at'>): Promise<Technology> {
    const [id] = await db('technologies').insert(technologyData);
    return await db('technologies').where('id', id).first();
  }

  static async getAllTechnologies(): Promise<Technology[]> {
    return await db('technologies')
      .select('technologies.*', 'users.name as created_by_name')
      .leftJoin('users', 'technologies.created_by', 'users.id')
      .orderBy('technologies.created_at', 'desc');
  }

  static async getTechnologyById(id: number): Promise<Technology | undefined> {
    return await db('technologies')
      .select('technologies.*', 'users.name as created_by_name')
      .leftJoin('users', 'technologies.created_by', 'users.id')
      .where('technologies.id', id)
      .first();
  }

  static async updateTechnology(id: number, updateData: Partial<Omit<Technology, 'id' | 'created_at'>>): Promise<Technology | undefined> {
    await db('technologies').where('id', id).update(updateData);
    return await db('technologies').where('id', id).first();
  }

  static async deleteTechnology(id: number): Promise<boolean> {
    const deletedCount = await db('technologies').where('id', id).del();
    return deletedCount > 0;
  }

  static async findByName(name: string): Promise<Technology | undefined> {
    return await db('technologies').where('name', name).first();
  }
}