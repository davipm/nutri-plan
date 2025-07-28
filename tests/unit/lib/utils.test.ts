import { describe, it, expect } from "vitest";
import { toStringSafe, toNumberSafe, comparePasswords, hashPassword } from "@/lib/utils";

describe("toStringSafe", () => {
  it("should convert a numeric value to its string representation", () => {
    expect(toStringSafe(123)).toBe("123");
    expect(toStringSafe(-45.6)).toBe("-45.6");
    expect(toStringSafe(0)).toBe("0");
  });

  it("should return the original string when the input is already a string", () => {
    expect(toStringSafe("hello world")).toBe("hello world");
    expect(toStringSafe("")).toBe("");
  });

  it("should convert an object to its default string representation '[object Object]'", () => {
    expect(toStringSafe({})).toBe("[object Object]");
    expect(toStringSafe({ a: 1, b: "test" })).toBe("[object Object]");
  });

  it("should return an empty string when the input value is null", () => {
    expect(toStringSafe(null)).toBe("");
  });

  it("should convert `undefined` to the string 'undefined'", () => {
    expect(toStringSafe(undefined)).toBe("undefined");
  });

  it("should convert a Symbol to its string representation", () => {
    const testSymbol = Symbol("test");
    expect(toStringSafe(testSymbol)).toBe("Symbol(test)");
  });
});

describe("toNumberSafe", () => {
  it("Converts a valid numeric string to a number", () => {
    expect(toNumberSafe("123")).toBe(123);
    expect(toNumberSafe("-42")).toBe(-42);
    expect(toNumberSafe("0")).toBe(0);
  });

  it("Returns the same number when the input is already a number", () => {
    expect(toNumberSafe(456)).toBe(456);
    expect(toNumberSafe(-78.9)).toBe(-78.9);
    expect(toNumberSafe(0)).toBe(0);
  });

  it("Converts a string representing a floating-point number", () => {
    expect(toNumberSafe("3.14")).toBe(3.14);
    expect(toNumberSafe("-0.5")).toBe(-0.5);
  });

  it("Returns 0 when the input is null", () => {
    expect(toNumberSafe(null)).toBe(0);
  });

  it("Returns 0 when the input is a non-numeric string", () => {
    expect(toNumberSafe("hello")).toBe(0);
    expect(toNumberSafe("")).toBe(0);
    expect(toNumberSafe("1a2b")).toBe(0);
  });

  it("Returns 0 when the input is undefined", () => {
    expect(toNumberSafe(undefined)).toBe(0);
  });
});

describe("comparePasswords", () => {
  it("should return true when a correct plain text password is provided for a given hash", async () => {
    const password = "myCorrectPassword";
    const hashedPassword = await hashPassword(password);
    const result = await comparePasswords(password, hashedPassword);
    expect(result).toBe(true);
  });

  it("should return false when an incorrect plain text password is provided for a given hash", async () => {
    const correctPassword = "myCorrectPassword";
    const incorrectPassword = "myIncorrectPassword";
    const hashedPassword = await hashPassword(correctPassword);
    const result = await comparePasswords(incorrectPassword, hashedPassword);
    expect(result).toBe(false);
  });

  it("should correctly compare a password containing various special characters and symbols", async () => {
    const specialPassword = `!@#$%^&*()_+-=[]{};':"\\|,.<>/?~`;
    const hashedPassword = await hashPassword(specialPassword);
    const result = await comparePasswords(specialPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it("should handle an invalid or malformed bcrypt hash string", async () => {
    const password = "anyPassword";
    const invalidHash = "not-a-valid-bcrypt-hash";
    // bcrypt.compare is designed to resolve to false for malformed hashes, not reject.
    const result = await comparePasswords(password, invalidHash);
    expect(result).toBe(false);
  });

  it("should correctly handle a password that exceeds bcrypt's 72-byte limit", async () => {
    // bcrypt truncates passwords at 72 bytes.
    const longPassword = "a".repeat(80);
    const truncatedEquivalentPassword = "a".repeat(72) + "b".repeat(8);
    const hashedPassword = await hashPassword(longPassword);

    // The comparison should be true because only the first 72 bytes are used.
    const result = await comparePasswords(
      truncatedEquivalentPassword,
      hashedPassword,
    );
    expect(result).toBe(true);
  });

  it("should handle an empty string as the password input", async () => {
    const emptyPassword = "";
    const hashedPassword = await hashPassword(emptyPassword);
    const correctResult = await comparePasswords(emptyPassword, hashedPassword);
    expect(correctResult).toBe(true);

    const incorrectResult = await comparePasswords("notEmpty", hashedPassword);
    expect(incorrectResult).toBe(false);
  });
});
