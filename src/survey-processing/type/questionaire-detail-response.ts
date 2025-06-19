export interface SurveyResponse {
    id: string;
    recipient_id: string;
    collection_mode: string;
    response_status: string;
    custom_value: string;
    first_name: string;
    last_name: string;
    email_address: string;
    ip_address: string;
    logic_path: Record<string, unknown>;
    metadata: {
      respondent: {
        user_agent: {
          type: string;
          value: string;
        };
        language: {
          type: string;
          value: string;
        };
      };
      contact: Record<string, unknown>;
    };
    page_path: any[]; // Empty in sample, can be detailed if structure known
    collector_id: string;
    survey_id: string;
    custom_variables: Record<string, unknown>;
    edit_url: string;
    analyze_url: string;
    total_time: number;
    date_modified: string; // ISO format string
    date_created: string;
    href: string;
    pages: Array<{
      id: string;
      questions: Array<{
        id: string;
        answers: Array<{
          tag_data?: any[];
          text?: string;
          choice_id?: string;
        }>;
      }>;
    }>;
  }
  