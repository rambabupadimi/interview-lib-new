import knex from 'knex';
import knexfile from '../knexfile';

const db = knex(knexfile.development);

export class QuestionRepository {
  static async findOrCreateCompany(name: string, created_by: number) {
    let company = await db('companies').where('name', name).first();
    if (!company) {
      const [newCompany] = await db('companies').insert({ name, created_by }).returning('*');
      company = newCompany;
    }
    return company;
  }

  static async findOrCreateExperience(years: number, created_by: number) {
    let experience = await db('experiences').where('years', years).andWhere('created_by', created_by).first();
    if (!experience) {
      const [newExperience] = await db('experiences').insert({ years, created_by }).returning('*');
      experience = newExperience;
    }
    return experience;
  }

  static async createQuestion({ title, technology_id, company_id, experience_id, created_by }: any) {
    const [questionId] = await db('questions').insert({
      title,
      technology_id,
      company_id,
      experience_id,
      created_by
    });

    // Fetch the created question since MySQL doesn't support returning('*')
    const question = await db('questions').where('id', questionId).first();
    return question;
  }

  static async createAnswer({ question_id, answer_text, created_by }: any) {
    const [answerId] = await db('answers').insert({
      question_id,
      answer_text,
      created_by
    });

    // Fetch the created answer since MySQL doesn't support returning('*')
    const answer = await db('answers').where('id', answerId).first();
    return answer;
  }

  static async getAllQuestionsWithAnswers() {
    const questions = await db('questions')
      .select(
        'questions.*',
        'companies.name as company_name',
        'experiences.years as experience_years',
        'users.name as created_by_name'
      )
      .leftJoin('companies', 'questions.company_id', 'companies.id')
      .leftJoin('experiences', 'questions.experience_id', 'experiences.id')
      .leftJoin('users', 'questions.created_by', 'users.id')
      .orderBy('questions.created_at', 'desc');

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await db('answers')
          .select(
            'answers.*',
            'users.name as created_by_name'
          )
          .leftJoin('users', 'answers.created_by', 'users.id')
          .where('answers.question_id', question.id)
          .orderBy('answers.created_at', 'desc');

        return {
          ...question,
          answers
        };
      })
    );

    return questionsWithAnswers;
  }

  static async getQuestionsByTechnology(technologyId: number) {
    const questions = await db('questions')
      .select(
        'questions.*',
        'companies.name as company_name',
        'experiences.years as experience_years',
        'users.name as created_by_name'
      )
      .leftJoin('companies', 'questions.company_id', 'companies.id')
      .leftJoin('experiences', 'questions.experience_id', 'experiences.id')
      .leftJoin('users', 'questions.created_by', 'users.id')
      .where('questions.technology_id', technologyId)
      .orderBy('questions.created_at', 'desc');

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await db('answers')
          .select(
            'answers.*',
            'users.name as created_by_name'
          )
          .leftJoin('users', 'answers.created_by', 'users.id')
          .where('answers.question_id', question.id)
          .orderBy('answers.created_at', 'desc');

        return {
          ...question,
          answers
        };
      })
    );

    return questionsWithAnswers;
  }

  static async getQuestionById(questionId: number) {
    return await db('questions').where('id', questionId).first();
  }

  static async deleteQuestionWithAnswers(questionId: number) {
    // Use a transaction to ensure both operations succeed or fail together
    return await db.transaction(async (trx) => {
      // First delete all answers associated with the question
      await trx('answers').where('question_id', questionId).del();

      // Then delete the question
      await trx('questions').where('id', questionId).del();
    });
  }

  static async updateQuestion(questionId: number, updateData: any) {
    await db('questions').where('id', questionId).update(updateData);

    // Fetch the updated question
    return await db('questions').where('id', questionId).first();
  }
}

// export const getAllQuestionsAndAnswersByTechnology = async (technologyId: string | number) => {
//   const questions = await db('questions')
//     .select(
//       'questions.*',
//       'companies.name as company_name',
//       'experiences.years as experience_years',
//       'users.name as created_by_name'
//     )
//     .leftJoin('companies', 'questions.company_id', 'companies.id')
//     .leftJoin('experiences', 'questions.experience_id', 'experiences.id')
//     .leftJoin('users', 'questions.created_by', 'users.id')
//     .where('questions.technology_id', technologyId)
//     .orderBy('questions.created_at', 'desc');

//   const questionsWithAnswers = await Promise.all(
//     questions.map(async (question) => {
//       const answers = await db('answers')
//         .select(
//           'answers.*',
//           'users.name as created_by_name'
//         )
//         .leftJoin('users', 'answers.created_by', 'users.id')
//         .where('answers.question_id', question.id)
//         .orderBy('answers.created_at', 'desc');

//       return {
//         ...question,
//         answers
//       };
//     })
//   );

//   return questionsWithAnswers;
// };