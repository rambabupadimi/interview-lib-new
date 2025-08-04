import knex from 'knex';
import knexfile from '../knexfile';

const db = knex(knexfile.development);

export interface Company {
  id?: number;
  name: string;
  created_by: number;
  created_at?: Date;
}

export class CompanyRepository {
  static async createCompany(companyData: Omit<Company, 'id' | 'created_at'>): Promise<Company> {
    const [id] = await db('companies').insert(companyData);
    return await db('companies').where('id', id).first();
  }

  static async getAllCompanies(): Promise<Company[]> {
    return await db('companies')
      .select('companies.*', 'users.name as created_by_name')
      .leftJoin('users', 'companies.created_by', 'users.id')
  }

  static async getCompanyById(id: number): Promise<Company | undefined> {
    return await db('companies')
      .select('companies.*', 'users.name as created_by_name')
      .leftJoin('users', 'companies.created_by', 'users.id')
      .where('companies.id', id)
      .first();
  }

  static async updateCompany(id: number, updateData: Partial<Omit<Company, 'id' | 'created_at'>>): Promise<Company | undefined> {
    await db('companies').where('id', id).update(updateData);
    return await db('companies').where('id', id).first();
  }

  static async deleteCompany(id: number): Promise<boolean> {
    const deletedCount = await db('companies').where('id', id).del();
    return deletedCount > 0;
  }

  static async findByName(name: string): Promise<Company | undefined> {
    return await db('companies').where('name', name).first();
  }
}