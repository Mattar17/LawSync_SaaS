export const CASE_STATUSES = [
  "قضية جديدة",
  "قيد المراجعة",
  "تم رفع الدعوى",
  "قيد النظر",
  "انتظار الجلسة",
  "تم تحديد جلسة",
  "قيد التحقيق",
  "انتظار الحكم",
  "تم الاستئناف",
  "تنفيذ الحكم",
  "موقوفة",
  "مغلقة",
  "كسبت",
  "خُسرت",
  "تمت التسوية",
  "رُفضت",
  "تم التنازل عنها",
] as const;

export type CASE_STATUSES = (typeof CASE_STATUSES)[number];

export const PARTY_ROLES = ["مدعي", "مدعى عليه"] as const;

export type PARTY_ROLES = (typeof PARTY_ROLES)[number];

export const CASE_TYPES = [
  "مدني",
  "جنائي",
  "تجاري",
  "عمالي",
  "أحوال شخصية",
  "إداري",
  "تنفيذ",
  "تعويضات",
  "إيجارات",
  "اقتصادي",
  "ضرائب",
  "جمارك",
] as const;

export type CASE_TYPES = (typeof CASE_TYPES)[number];

export const CASE_DEGREES = ["أول درجة", "استئناف", "نقض", "التماس"] as const;

export type CASE_DEGREES = (typeof CASE_DEGREES)[number];

export const CLIENT_TYPES = [
  "فرد",
  "شركة تضامن",
  "شركة توصية بسيطة",
  "شركة مساهمة",
  "شركة ذات مسؤولية محدودة",
  "شركة الشخص الواحد",
  "جهة حكومية",
  "أخرى",
] as const;

export type CLIENT_TYPES = (typeof CLIENT_TYPES)[number];

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
  client_national_id: string;
  client_opponent_national_id: string;
  case_type?: CASE_TYPES | null;
  case_degree?: CASE_DEGREES | null;
  client_type?: CLIENT_TYPES | null;
  latest_court_session_date?: string | null;
  next_court_session_date?: string | null;
  case_status: CASE_STATUSES;
  latest_update: string;
  assigned_lawyer_id?: string | null;
  created_at: string;
}
