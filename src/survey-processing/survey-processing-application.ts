import { NextFunction } from 'express';
import { TypedRequestBody, TypedResponse } from '../utils/types';
import { authenticateToSFCC } from '../utils/sfccAuth';
import { Response } from 'express';
import { SurveyRequestType } from './request/type';


export const surveyProcessingApplication = async (
  req: TypedRequestBody<SurveyRequestType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      SFCC_CLIENT_ID,
      SFCC_CLIENT_SECRET
    } = process.env;

    const surveyId: string = req.body.resources.survey_id;
    if (!surveyId) {
      return res.status(400).json({ error: "survey_id is required" });
    }

    // // 1. Get Survey Info
    // const surveyResponse = await axios.get(
    //   `https://api.surveymonkey.com/v3/surveys/${surveyId}/details`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${SURVEYMONKEY_TOKEN}`,
    //     },
    //   }
    // );

    // const surveyTitle: string = surveyResponse.data.title;

    // 2. Authenticate to SFCC
    const clientId = SFCC_CLIENT_ID || '';
    const clientSecret = SFCC_CLIENT_SECRET || '';
    const accessToken = await authenticateToSFCC(clientId, clientSecret);

    console.log(accessToken);
    // // 3. Update Order in OCAPI
    // const updateResponse = await axios.patch(
    //   `${SFCC_OCAPI_BASE_URL}/orders/${SFCC_ORDER_ID}`,
    //   {
    //     custom: {
    //       surveyTitle__c: surveyTitle,
    //     },
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    res.status(200).json({ message: "Success", updatedOrder: accessToken });
  } catch (error: any) {
    next(error);
  }
};

