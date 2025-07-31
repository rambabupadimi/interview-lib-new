import { Request, Response } from 'express';
import { QuestionRepository } from '../repositories/question.repository';

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { title, technology_id, company_id, experience_id } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Question title is required.'
      });
    }

    // Get user ID from authenticated request
    const user = (req as any).user;
    const created_by = user.userId;

    const question = await QuestionRepository.createQuestion({
      title,
      technology_id: technology_id || null,
      company_id: company_id || null,
      experience_id: experience_id || null,
      created_by
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create question.'
    });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, technology_id, company_id, experience_id } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID',
        message: 'Question ID must be a valid number.'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Question title is required.'
      });
    }

    const questionId = Number(id);

    // Check if question exists
    const existingQuestion = await QuestionRepository.getQuestionById(questionId);
    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        message: 'Question with the specified ID does not exist.'
      });
    }

    const updatedQuestion = await QuestionRepository.updateQuestion(questionId, {
      title,
      technology_id: technology_id || null,
      company_id: company_id || null,
      experience_id: experience_id || null
    });

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: updatedQuestion
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update question.'
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID',
        message: 'Question ID must be a valid number.'
      });
    }

    const questionId = Number(id);

    // Check if question exists
    const question = await QuestionRepository.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        message: 'Question with the specified ID does not exist.'
      });
    }

    // Delete question and all its answers
    await QuestionRepository.deleteQuestionWithAnswers(questionId);

    res.json({
      success: true,
      message: 'Question and all associated answers deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete question.'
    });
  }
};

// Get all questions with nested answers
export const getAllQuestionsWithAnswers = async (req: Request, res: Response) => {
  try {
    const questions = await QuestionRepository.getAllQuestionsWithAnswers();

    res.json({
      success: true,
      message: 'Questions retrieved successfully',
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions with answers:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch questions and answers.'
    });
  }
};

// Get questions by technology ID
export const getQuestionsByTechnology = async (req: Request, res: Response) => {
  try {
    const { technologyId } = req.params;

    if (!technologyId || isNaN(Number(technologyId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid technology ID',
        message: 'Technology ID must be a valid number.'
      });
    }

    const questions = await QuestionRepository.getQuestionsByTechnology(Number(technologyId));

    res.json({
      success: true,
      message: 'Questions retrieved successfully',
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions by technology:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch questions by technology.'
    });
  }
};

// New: Single post for question+answer
export const createQuestionWithAnswer = async (req: Request, res: Response) => {
  const { question, answer, company, experience, technology_id } = req.body;
  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'Question and answer are required.'
    });
  }
  // Get user ID from authenticated request
  const user = (req as any).user;
  const created_by = user.userId;
  try {
    let company_id, experience_id;
    if (company) {
      const companyRow = await QuestionRepository.findOrCreateCompany(company, created_by);
      company_id = companyRow.id;
    }
    if (experience) {
      const experienceRow = await QuestionRepository.findOrCreateExperience(experience, created_by);
      experience_id = experienceRow.id;
    }
    const questionRow = await QuestionRepository.createQuestion({
      title: question,
      technology_id: technology_id || null,
      company_id,
      experience_id,
      created_by
    });

    const answerRow = await QuestionRepository.createAnswer({
      question_id: questionRow.id,
      answer_text: answer,
      created_by
    });
    res.status(201).json({
      success: true,
      message: 'Question and answer created',
      data: {
        question: questionRow,
        answer: answerRow
      }
    });
  } catch (error) {
    console.error('Error creating question with answer:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create question and answer.'
    });
  }
};

export const getAllQuestionsAndAnswersByTechnology = async (req, res) => {
  try {
    const { technologyId } = req.params;
    const questionsWithAnswers = await QuestionRepository.getQuestionsByTechnology(technologyId);
    res.json(questionsWithAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions and answers', error: error.message });
  }
};
