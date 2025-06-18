import { NextFunction } from 'express';
import { TypedRequestBody, TypedResponse } from '../utils/types';
import { authenticateToSFCC } from '../utils/sfccAuth';
import { Response } from 'express';
import { SurveyRequestType } from './type/request';
import axios from 'axios';

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

    console.log(req.body);
    const surveyId = req.body.resources.survey_id;
    const responseId = req.body.event_id;
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

    // 3. Update Order in OCAPI
    const data = {
      c_email: "nguyen.minhquang+1@f.flect.co.jp",
      c_isProcessed: false
    };

    try {
      const response = await axios.put(`${process.env.SFCC_OCAPI_BASE_URL}/012434587`, data, {
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
      res.status(500).json({
        message: 'Error updating SFCC custom object',
        error: error?.response?.data || error.message
      });
    }
  } catch (error: any) {
    next(error);
  }
};

