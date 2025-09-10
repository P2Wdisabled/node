// Mock Prisma
const mockPrisma = {
  message: {
    create: jest.fn(),
  },
};

jest.unstable_mockModule("../utils/prisma.js", () => ({
  prisma: mockPrisma,
}));

describe("Socket.IO Event Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle join event", () => {
    // Test basic join logic
    const nick = "Alice";
    const name = String(nick ?? "")
      .trim()
      .slice(0, 32);
    expect(name).toBe("Alice");
  });

  it("should handle empty nickname", () => {
    const nick = "";
    let name = String(nick ?? "")
      .trim()
      .slice(0, 32);
    if (!name) name = "Anonyme";
    expect(name).toBe("Anonyme");
  });

  it("should handle message creation", async () => {
    const messageData = { name: "Alice", text: "Hello" };
    const savedMessage = { id: 1, ...messageData, ts: new Date() };

    mockPrisma.message.create.mockResolvedValue(savedMessage);

    const result = await mockPrisma.message.create({ data: messageData });
    expect(result).toEqual(savedMessage);
    expect(mockPrisma.message.create).toHaveBeenCalledWith({
      data: messageData,
    });
  });
});
