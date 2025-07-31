import { Router } from 'express';
import * as QuestionController from '../controllers/question.controller';
import * as AnswerController from '../controllers/answer.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Protect all question routes
router.use(authenticateJWT);

// Questions
router.get('/', QuestionController.getAllQuestionsWithAnswers);
router.get('/technology/:technologyId', QuestionController.getQuestionsByTechnology);
// New route for all questions and answers by technologyId
router.get('/all-with-answers/technology/:technologyId', QuestionController.getAllQuestionsAndAnswersByTechnology);
router.post('/', QuestionController.createQuestion);
router.put('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);

// Answers
router.post('/:questionId/answers', AnswerController.createAnswer);
router.put('/answers/:id', AnswerController.updateAnswer);
router.delete('/answers/:id', AnswerController.deleteAnswer);

// New: Single post for question+answer
router.post('/with-answer', QuestionController.createQuestionWithAnswer);

export default router;