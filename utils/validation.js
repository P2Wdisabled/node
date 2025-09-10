// Utility functions for validation and formatting
// These functions are extracted from app.js to be easily testable

export const formatMessage = (message) => {
  return { ...message, ts: message.ts.toISOString() };
};

export const validateNickname = (nick) => {
  const name = String(nick ?? "")
    .trim()
    .slice(0, 32);
  return name || "Anonyme";
};

export const validateMessage = (raw) => {
  const text = String(raw ?? "")
    .trim()
    .slice(0, 1000);
  return text || null;
};

export const calculateMessageLimit = (queryLimit) => {
  const limit = Number(queryLimit ?? 50);
  return Math.min(isNaN(limit) ? 50 : limit, 200);
};
