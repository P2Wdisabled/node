import {
  formatMessage,
  validateNickname,
  validateMessage,
  calculateMessageLimit,
} from "../utils/validation.js";

// Tests unitaires pour les fonctions utilitaires
describe("Utility Functions", () => {
  describe("calculateMessageLimit", () => {
    it("should return default limit when no parameter provided", () => {
      expect(calculateMessageLimit()).toBe(50);
    });

    it("should return provided limit when valid", () => {
      expect(calculateMessageLimit(100)).toBe(100);
    });

    it("should cap limit at 200", () => {
      expect(calculateMessageLimit(500)).toBe(200);
    });

    it("should handle invalid limit parameter", () => {
      expect(calculateMessageLimit("invalid")).toBe(50);
    });

    it("should handle null limit", () => {
      expect(calculateMessageLimit(null)).toBe(50);
    });
  });

  describe("validateNickname", () => {
    it("should return valid nickname", () => {
      expect(validateNickname("Alice")).toBe("Alice");
    });

    it("should trim whitespace", () => {
      expect(validateNickname("  Alice  ")).toBe("Alice");
    });

    it("should slice to 32 characters", () => {
      const longName = "A".repeat(50);
      expect(validateNickname(longName)).toBe("A".repeat(32));
    });

    it("should return 'Anonyme' for empty string", () => {
      expect(validateNickname("")).toBe("Anonyme");
    });

    it("should return 'Anonyme' for null", () => {
      expect(validateNickname(null)).toBe("Anonyme");
    });

    it("should return 'Anonyme' for undefined", () => {
      expect(validateNickname(undefined)).toBe("Anonyme");
    });
  });

  describe("validateMessage", () => {
    it("should return valid message", () => {
      expect(validateMessage("Hello world")).toBe("Hello world");
    });

    it("should trim whitespace", () => {
      expect(validateMessage("  Hello  ")).toBe("Hello");
    });

    it("should slice to 1000 characters", () => {
      const longMessage = "A".repeat(1500);
      expect(validateMessage(longMessage)).toBe("A".repeat(1000));
    });

    it("should return null for empty string", () => {
      expect(validateMessage("")).toBe(null);
    });

    it("should return null for null", () => {
      expect(validateMessage(null)).toBe(null);
    });

    it("should return null for undefined", () => {
      expect(validateMessage(undefined)).toBe(null);
    });
  });

  describe("formatMessage", () => {
    it("should format message with ISO timestamp", () => {
      const message = {
        id: 1,
        name: "Alice",
        text: "Hello",
        ts: new Date("2024-01-01T10:00:00Z"),
      };

      const formatted = formatMessage(message);
      expect(formatted.ts).toBe("2024-01-01T10:00:00.000Z");
      expect(formatted.id).toBe(1);
      expect(formatted.name).toBe("Alice");
      expect(formatted.text).toBe("Hello");
    });
  });
});
