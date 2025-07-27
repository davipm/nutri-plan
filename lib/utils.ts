import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a given value to its string representation safely.
 * If the value is null, it returns an empty string.
 * If the value is not null, it converts the value to a string using `String`.
 *
 * @param {unknown} value - The value to be converted to a string.
 * @returns {string} The string representation of the given value, or an empty string if the value is null.
 */
export const toStringSafe = (value: unknown): string => {
  return value === null ? "" : String(value);
};

/**
 * Converts a given value to a number safely.
 *
 * If the input value is null, the function will return 0.
 * If the input value is already of type number, it will return the value unchanged.
 * For other types, the function attempts to parse the value as a number.
 * If parsing fails and the result is NaN, the function will return 0.
 *
 * @param {unknown} value - The value to be converted to a number.
 * @returns {number} The converted number or 0 if conversion is not possible.
 */
export const toNumberSafe = (value: unknown): number => {
  if (value === null) return 0;
  if (typeof value === "number") return value;

  const parsedValue = Number(value);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

/**
 * Asynchronously generates a hashed version of the provided password.
 *
 * This function uses bcrypt to generate a salt and then hashes the provided
 * password with the generated salt. The salt helps ensure the security of the
 * hashed password by making it resistant to rainbow table attacks.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password to determine if they match.
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword);
};
