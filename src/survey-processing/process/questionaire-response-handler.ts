import axios from "axios";
import { SurveyResponse } from "../type/questionaire-detail-response";

interface SurveyAnswer {
  questionId: string;
  answerText?: string;
  choiceId?: string;
}

export const getQuestionnaireResponseDetails = async (
  surveyId: string,
  respondentId: string
): Promise<SurveyAnswer[]> => {
  try {
    const { SURVEYMONKEY_TOKEN, SURVEYMONKEY_API_URL } = process.env;

    if (!SURVEYMONKEY_TOKEN || !SURVEYMONKEY_API_URL) {
      throw new Error("Missing SurveyMonkey config in environment variables");
    }

    const response = await axios.get(
      `${SURVEYMONKEY_API_URL}/surveys/${surveyId}/responses/${respondentId}/details`,
      {
        headers: {
          Authorization: `Bearer ${SURVEYMONKEY_TOKEN}`,
        },
      }
    );

    const data = response.data as SurveyResponse;

    const answers: SurveyAnswer[] = [];

    for (const page of data.pages || []) {
      for (const question of page.questions || []) {
        for (const answer of question.answers || []) {
          answers.push({
            questionId: question.id,
            answerText: answer.text,
            choiceId: answer.choice_id,
          });
        }
      }
    }

    return answers;
  } catch (error: any) {
    console.error("Failed to fetch SurveyMonkey response:", error.response?.data || error.message);
    throw new Error("Error fetching SurveyMonkey response details");
  }
};
