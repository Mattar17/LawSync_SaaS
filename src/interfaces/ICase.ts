export default interface Case {
  lawyer_id: number;
  case_number: string;
  case_year: number;

  client_name: string;
  client_national_id: string;
  client_role: string;

  client_opponent_name: string;
  client_opponent_national_id: string;
  client_opponent_role: string;

  next_court_session_date: string;
  latest_court_session_date: string;

  case_status: string;
}
