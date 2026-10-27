export const APPOINTMENT_STATUSES = ["Normal", "Emergency", "Confirmed", "Completed", "Cancelled"] as const;
export const PAYMENT_STATUSES = ["Unpaid", "Paid", "Partial"] as const;
export const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Net Banking"] as const;
export const REPORT_STATUSES = ["Pending", "Received", "Reviewed", "Critical"] as const;
export const GENDERS = ["Male", "Female", "Other"] as const;
export const AVAILABILITY = ["Morning", "Afternoon", "Evening", "Night"] as const;

/** Upper bound on rows rendered per list; keeps pages fast as data grows. */
export const LIST_LIMIT = 100;
