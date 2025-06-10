import { NextFunction } from 'express';
import { TypedRequestBody, TypedResponse } from '../utils/types.ts';

export const surveyProcessingApplication = async (
  req: TypedRequestBody<CreateSubsidyApplicationRequest>,
  res: TypedResponse<CreateSubsidyApplicationDto>,
  next: NextFunction
) => {
  try {
    const surveyId: string = req.body.survey_id;
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

    res.status(200).json({ message: "Success", updatedOrder: 'testing' });
  } catch (error: any) {
    next(error);
  }
};

