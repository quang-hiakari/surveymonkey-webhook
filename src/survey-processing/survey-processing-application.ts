import { NextFunction } from 'express';
import { TypedRequestBody, TypedResponse } from '../utils/types';
import { authenticateToSFCC } from '../utils/sfccAuth';
import { Response } from 'express';
import { SurveyRequestType } from './type/request';
import axios from 'axios';
import { getQuestionnaireResponseDetails } from './questionaire-response-handler';

export const surveyProcessingApplication = async (
  req: TypedRequestBody<SurveyRequestType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      SFCC_CLIENT_ID,
      SFCC_CLIENT_SECRET,
      SURVERYMONKEY_EMAIL_QUESTION_ID,
      SURVERYMONKEY_ORDER_QUESTION_ID,
      REWARD_POINT
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
    const email = answerMap[SURVERYMONKEY_EMAIL_QUESTION_ID || ""];
    const orderNumber = answerMap[SURVERYMONKEY_ORDER_QUESTION_ID || ""];

    if (!email || !orderNumber) {
      return res.status(400).json({ error: "Missing email or order number in response" });
    }

    // 2. Authenticate to SFCC
    const clientId = SFCC_CLIENT_ID || '';
    const clientSecret = SFCC_CLIENT_SECRET || '';
    const accessToken = await authenticateToSFCC(clientId, clientSecret);

    // 3. Update Order in OCAPI
    const data = {
      c_email: email,
      c_isProcessed: false,
      c_rewardPoint:Number(REWARD_POINT)
    };

    try {
      const response = await axios.put(`${process.env.SFCC_OCAPI_BASE_URL}/${orderNumber}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json({
        message: 'AnsweredQuestionaire registered successful',
        data: response.data
      });
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      res.status(500).json({
        message: 'Error updating SFCC custom object',
        error: error?.response?.data || error.message
      });
    }
  } catch (error: any) {
    next(error);
  }
};

