export interface SurveyRequestType {
    name: string;
    filter_type: 'survey' | 'collector';
    filter_id: string;
    event_type: 'response_completed' | 'response_disqualified' | 'response_updated';
    event_id: string;
    object_type: 'response' | string;
    object_id: string;
    event_datetime: string;
  
    resources: {
      collector_id: string;
      survey_id: string;
      user_id: string;
    };
  };