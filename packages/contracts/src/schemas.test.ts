import { describe, it, expect } from "vitest";
import {
  RegisterInputSchema,
  LoginInputSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from "./schemas.js";

describe("RegisterInputSchema", () => {
  it("normalizes and lowercases email", () => {
    const parsed = RegisterInputSchema.parse({
      name: "Amira",
      email: "  DEMO@Masrouf.Test  ",
      password: "securePassword123",
    });
    expect(parsed.email).toBe("demo@masrouf.test");
  });

  it("rejects password shorter than 10 characters", () => {
    expect(() =>
      RegisterInputSchema.parse({
        name: "Amira",
        email: "demo@masrouf.test",
        password: "short",
      })
    ).toThrow();
  });

  it("rejects unknown keys", () => {
    expect(() =>
      RegisterInputSchema.parse({
        name: "Amira",
        email: "demo@masrouf.test",
        password: "securePassword123",
        role: "admin",
      })
    ).toThrow();
  });
});

describe("LoginInputSchema", () => {
  it("normalizes and lowercases email", () => {
    const parsed = LoginInputSchema.parse({
      email: "  DEMO@Masrouf.Test ",
      password: "somePassword123",
    });
    expect(parsed.email).toBe("demo@masrouf.test");
  });
});

describe("CreateTransactionSchema", () => {
  it("validates positive amount in minor units", () => {
    const valid = {
      accountId: "11111111-1111-1111-1111-111111111111",
      categoryId: "22222222-2222-2222-2222-222222222222",
      kind: "EXPENSE",
      amountMinor: 15400,
      occurredOn: "2026-10-28",
      payee: "Monoprix",
      note: "Courses",
    };
    expect(CreateTransactionSchema.parse(valid)).toMatchObject(valid);
  });

  it("rejects zero or negative amount", () => {
    const invalid = {
      accountId: "11111111-1111-1111-1111-111111111111",
      categoryId: "22222222-2222-2222-2222-222222222222",
      kind: "EXPENSE",
      amountMinor: 0,
      occurredOn: "2026-10-28",
      payee: "Monoprix",
    };
    expect(() => CreateTransactionSchema.parse(invalid)).toThrow();
  });

  it("rejects invalid calendar dates like 2026-02-30", () => {
    const invalid = {
      accountId: "11111111-1111-1111-1111-111111111111",
      categoryId: "22222222-2222-2222-2222-222222222222",
      kind: "EXPENSE",
      amountMinor: 5000,
      occurredOn: "2026-02-30",
      payee: "Monoprix",
    };
    expect(() => CreateTransactionSchema.parse(invalid)).toThrow();
  });
});

describe("UpdateTransactionSchema", () => {
  it("rejects empty object update", () => {
    expect(() => UpdateTransactionSchema.parse({})).toThrow();
  });
});
