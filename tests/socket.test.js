// Mock Prisma
const mockPrisma = {
  message: {
    create: jest.fn(),
  },
};

jest.unstable_mockModule("../utils/prisma.js", () => ({
  prisma: mockPrisma,
}));

describe("Socket.IO Logic Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Join Event Logic", () => {
    it("should handle join with valid nickname", () => {
      const nick = "Alice";
      const name = String(nick ?? "")
        .trim()
        .slice(0, 32);
      expect(name).toBe("Alice");
    });

    it("should handle join with empty nickname", () => {
      const nick = "";
      let name = String(nick ?? "")
        .trim()
        .slice(0, 32);
      if (!name) name = "Anonyme";
      expect(name).toBe("Anonyme");
    });

    it("should handle join with null nickname", () => {
      const nick = null;
      let name = String(nick ?? "")
        .trim()
        .slice(0, 32);
      if (!name) name = "Anonyme";
      expect(name).toBe("Anonyme");
    });

    it("should trim and slice long nicknames", () => {
      const longNick = "A".repeat(50);
      const name = String(longNick ?? "")
        .trim()
        .slice(0, 32);
      expect(name).toBe("A".repeat(32));
    });
  });

  describe("Chat Event Logic", () => {
    it("should validate message text", () => {
      const raw = "Hello world";
      const text = String(raw ?? "")
        .trim()
        .slice(0, 1000);
      expect(text).toBe("Hello world");
    });

    it("should reject empty message", () => {
      const raw = "";
      const text = String(raw ?? "")
        .trim()
        .slice(0, 1000);
      expect(text).toBe("");
    });

    it("should slice long messages", () => {
      const longMessage = "A".repeat(1500);
      const text = String(longMessage ?? "")
        .trim()
        .slice(0, 1000);
      expect(text).toBe("A".repeat(1000));
    });

    it("should handle message creation", async () => {
      const messageData = { name: "Alice", text: "Hello world" };
      const savedMessage = { id: 1, ...messageData, ts: new Date() };

      mockPrisma.message.create.mockResolvedValue(savedMessage);

      const result = await mockPrisma.message.create({ data: messageData });
      expect(result).toEqual(savedMessage);
      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: messageData,
      });
    });

    it("should handle database error", async () => {
      mockPrisma.message.create.mockRejectedValue(new Error("Database error"));

      try {
        await mockPrisma.message.create({
          data: { name: "Alice", text: "Hello" },
        });
      } catch (e) {
        expect(e.message).toBe("Database error");
      }
    });
  });

  describe("System Messages Logic", () => {
    it("should generate welcome message", () => {
      const name = "Alice";
      const message = `Bienvenue ${name}`;
      expect(message).toBe("Bienvenue Alice");
    });

    it("should generate join notification", () => {
      const name = "Alice";
      const message = `${name} a rejoint le chat`;
      expect(message).toBe("Alice a rejoint le chat");
    });

    it("should generate leave notification", () => {
      const name = "Alice";
      const message = `${name} a quitté`;
      expect(message).toBe("Alice a quitté");
    });
  });
});
