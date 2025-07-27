import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Prisma client and errors
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

vi.mock("@prisma/client", async () => {
  const actual: any = await vi.importActual("@prisma/client");

  return {
    ...actual,
    PrismaClient: vi.fn(),
    Prisma: {
      ...actual.Prisma,
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        code: string;
        clientVersion: string;
        meta?: any;

        constructor(params: {
          code: string;
          clientVersion: string;
          meta?: any;
          message: string;
        }) {
          super(params.message);
          this.code = params.code;
          this.clientVersion = params.clientVersion;
          this.meta = params.meta;
          this.name = "PrismaClientKnownRequestError";
        }
      },
    },
  };
});
