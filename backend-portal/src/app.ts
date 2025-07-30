import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import technologyRoutes from './routes/technology.routes';
import companyRoutes from './routes/company.routes';
import questionRoutes from './routes/question.routes';
import commentRoutes from './routes/comment.routes';
import likeRoutes from './routes/like.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Interview Library API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      technologies: '/api/technologies',
      companies: '/api/companies',
      questions: '/api/questions',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app; 