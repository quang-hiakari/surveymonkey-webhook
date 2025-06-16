import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { errorHandler } from './common/middleware/error-handler-middleware';

//import router
import { router as surverProcessing } from './survey-processing/routes/index';


dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

//Config expess
const app: Express = express();

//output request log
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 8080);

//Subsidy Router
app.use('/api/survey', surverProcessing);


//Not in routes
app.use(function (_req: Request, res: Response) {
  res.status(404).json({ error: '404 not found' });
});

// error handler
app.use(errorHandler);

export default app;
