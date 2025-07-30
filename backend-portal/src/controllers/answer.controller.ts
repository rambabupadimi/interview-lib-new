import { Request, Response } from 'express';
import { AnswerRepository } from '../repositories/answer.repository';

export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const { answer_text } = req.body;
    
    if (!questionId || isNaN(Number(questionId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID',
        message: 'Question ID must be a valid number.'
      });
    }

    if (!answer_text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Answer text is required.'
      });
    }

    // Get user ID from authenticated request
    const user = (req as any).user;
    const created_by = user.userId;

    const answer = await AnswerRepository.createAnswer({
      question_id: Number(questionId),
      answer_text,
      created_by
    });

    res.status(201).json({
      success: true,
      message: 'Answer created successfully',
      data: answer
    });
  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create answer.'
    });
  }
};

export const updateAnswer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answer_text } = req.body;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid answer ID',
        message: 'Answer ID must be a valid number.'
      });
    }

    if (!answer_text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Answer text is required.'
      });
    }

    const answerId = Number(id);
    
    // Check if answer exists
    const existingAnswer = await AnswerRepository.getAnswerById(answerId);
    if (!existingAnswer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found',
        message: 'Answer with the specified ID does not exist.'
      });
    }

    const updatedAnswer = await AnswerRepository.updateAnswer(answerId, {
      answer_text
    });

    res.json({
      success: true,
      message: 'Answer updated successfully',
      data: updatedAnswer
    });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update answer.'
    });
  }
};

export const deleteAnswer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid answer ID',
        message: 'Answer ID must be a valid number.'
      });
    }

    const answerId = Number(id);
    
    // Check if answer exists
    const answer = await AnswerRepository.getAnswerById(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found',
        message: 'Answer with the specified ID does not exist.'
      });
    }

    await AnswerRepository.deleteAnswer(answerId);
    
    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete answer.'
    });
  }
}; 