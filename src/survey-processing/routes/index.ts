import { Router } from 'express';
import { surveyProcessingApplication } from '../survey-processing-application';
import { verifySurveyMonkeyKey } from '../../common/middleware/verify-key-middleware';

export const router = Router();

router.post('/survey-processing', verifySurveyMonkeyKey, surveyProcessingApplication);

export default router;