import { NextFunction } from 'express';
import { TypedRequestBody } from '../utils/types';
import { getSFCCAccessToken } from '../utils/sfcc-token-manager';
import { Response } from 'express';
import { SurveyRequestType } from './type/request';
import { getQuestionnaireResponseDetails } from './questionaire-response-handler';
import { createCustomObjectIfNotExists } from './create-record-in-sfcc';

export const surveyProcessingApplication = async (
  req: TypedRequestBody<SurveyRequestType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      SURVERYMONKEY_EMAIL_QUESTION_ID = '',
      SURVERYMONKEY_ORDER_QUESTION_ID = '',
      REWARD_POINT = 0
    } = process.env;
    console.log("Webhook called");
    console.log(req.body);
    const surveyId = req.body.resources.survey_id;
    const responseId = req.body.resources.respondent_id;

    if (!surveyId) {
      return res.status(400).json({ error: "survey_id is required" });
    }
    if (!responseId) {
      return res.status(400).json({ error: "respondent_id is required" });
    }

    // Call SurveryMonkeyAPI to get response details
    const answeredQuestions = await getQuestionnaireResponseDetails(surveyId, responseId);

    const answerMap = Object.fromEntries(
      answeredQuestions.map(a => [a.questionId, a.answerText || ""])
    );

    // Get user's Email & OrderNumber from list answered question, base on questionId
    const email = answerMap[SURVERYMONKEY_EMAIL_QUESTION_ID];
    const orderNumber = answerMap[SURVERYMONKEY_ORDER_QUESTION_ID];

    if (!email || !orderNumber) {
      return res.status(400).json({ error: "Missing email or order number in response" });
    }
    console.log(`Extracted Email: ${email}, Order Number: ${orderNumber}`);

    // 2. Authenticate to SFCC
    const accessToken = await getSFCCAccessToken();

    // 3. Create AnsweredQuestionaire record in CC via OCAPI
    const data = {
      c_email: email,
      c_isProcessed: false,
      c_rewardPoint:Number(REWARD_POINT)
    };

    const result = await createCustomObjectIfNotExists(accessToken, orderNumber, data);
    res.status(200).json({
      message: 'AnsweredQuestionaire registered successful',
      data: result.data ?? result.message
    });

  } catch (error: any) {
    next(error);
  }
};

