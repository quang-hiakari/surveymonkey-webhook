import { Router } from 'express';
import { surveyProcessingApplication } from '../survey-processing-application';
import { verifySurveyMonkeyKey } from '../../common/middleware/verify-key-middleware';

export const router = Router();

router.post('/survey-processing', verifySurveyMonkeyKey, surveyProcessingApplication);

// HEAD router for SurveyMonkey verification when register new webhooks
router.head('/survey-processing', (req, res) => {
  res.sendStatus(200);
});
export default router;