import { Router } from 'express';
import { surveyProcessingApplication } from '../survey-processing-application';

export const router = Router();

router.post('/survey-processing', surveyProcessingApplication);