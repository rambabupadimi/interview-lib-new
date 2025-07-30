import knex from 'knex';
import knexfile from '../knexfile';

const db = knex(knexfile.development);

export class AnswerRepository {
  static async createAnswer({ question_id, answer_text, created_by }: any) {
    const [answerId] = await db('answers').insert({
      question_id,
      answer_text,
      created_by
    });
    // Fetch the created answer
    return await db('answers').where('id', answerId).first();
  }

  static async getAnswerById(answerId: number) {
    return await db('answers').where('id', answerId).first();
  }

  static async updateAnswer(answerId: number, updateData: any) {
    await db('answers').where('id', answerId).update(updateData);
    return await db('answers').where('id', answerId).first();
  }

  static async deleteAnswer(answerId: number) {
    return await db('answers').where('id', answerId).del();
  }
} 