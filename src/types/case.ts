export interface Case {
  id: string;
  office_id: string;
  title: string;
  description?: string | null;
  case_number: string;
  case_year: string;
  client_name: string;
  client_opponent_name: string;
  client_role: PARTY_ROLES;
  client_opponent_role: PARTY_ROLES;
  client_national_id: string;
  client_opponent_national_id: string;
  latest_court_session_date?: string | null;
  next_court_session_date?: string | null;
  case_status: CASE_STATUSES;
  latest_update: string;
  assigned_lawyer_id?: string | null;
  created_at: string;
}

export type CASE_STATUSES =
  | "قضية جديدة"
  | "قيد المراجعة"
  | "تم رفع الدعوى"
  | "قيد النظر"
  | "انتظار الجلسة"
  | "تم تحديد جلسة"
  | "قيد التحقيق"
  | "انتظار الحكم"
  | "تم الاستئناف"
  | "تنفيذ الحكم"
  | "موقوفة"
  | "مغلقة"
  | "كسبت"
  | "خُسرت"
  | "تمت التسوية"
  | "رُفضت"
  | "تم التنازل عنها";

export type PARTY_ROLES = "مدعي" | "مدعى عليه" | "مستأنف" | "مستأنف ضده";
