export const eventNames = [
  "landing_viewed", "onboarding_started", "question_answered", "free_text_submitted",
  "onboarding_completed", "recommendations_generated", "recommendation_impression",
  "city_opened", "city_saved", "city_unsaved", "comparison_started",
  "comparison_city_added", "preference_refined", "result_shared",
  "city_rejected", "match_feedback_submitted", "email_capture_submitted",
] as const;

export type EventName = (typeof eventNames)[number];
export type EventProperties = Record<string, string | number | boolean>;
