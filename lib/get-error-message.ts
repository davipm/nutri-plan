import { Prisma } from "@/generated/prisma";
import { fromError } from "zod-validation-error";

import { ZodError } from "zod";
import { AuthError } from "next-auth";

const PRISMA_ERROR_CODES = new Map<string, string>([
  [
    "P2000",
    "The provided value for the column is too long for the column's type",
  ],
  ["P2001", "The record searched for in the where condition does not exist"],
  ["P2002", "Unique constraint failed"],
  ["P2003", "Foreign key constraint failed"],
  ["P2004", "A constraint failed on the database"],
  [
    "P2005",
    "The value stored in the database for the field is invalid for the field's type",
  ],
  ["P2006", "The provided value for the field is not valid"],
  ["P2007", "Data validation error"],
  ["P2008", "Failed to parse the query"],
  ["P2009", "Failed to validate the query"],
  ["P2010", "Raw query failed"],
  ["P2011", "Null constraint violation"],
  ["P2012", "Missing a required value"],
  ["P2013", "Missing a required argument"],
  [
    "P2014",
    "The change you are trying to make would violate the required relation",
  ],
  ["P2015", "A related record could not be found"],
  ["P2016", "Query interpretation error"],
  [
    "P2017",
    "The records for relation between the parent and child models are not connected",
  ],
  ["P2018", "The required connected records were not found"],
  ["P2019", "Input error"],
  ["P2020", "Value out of range for the type"],
  ["P2021", "The table does not exist in the current database"],
  ["P2022", "The column does not exist in the current database"],
  ["P2023", "Inconsistent column data"],
  ["P2024", "Timed out fetching a new connection from the pool"],
  [
    "P2025",
    "An operation failed because it depends on one or more records that were required but not found",
  ],
  [
    "P2026",
    "The current database provider doesn't support a feature that the query used",
  ],
  ["P2027", "Multiple errors occurred on the database during query execution"],
]);

/**
 * A function to retrieve a user-friendly error message based on the provided error type.
 *
 * This function handles multiple error types:
 * - AuthError: Indicates authentication failure or missing users and provides a predefined message.
 * - ZodError: Extracts and returns the validation error message if available.
 * - PrismaClientKnownRequestError: Uses a mapping of Prisma error codes to return appropriate messages,
 *   with special handling for duplicate record errors (e.g., `P2002` with meta information).
 * - PrismaClientValidationError: Returns a predefined message for invalid data errors.
 * - Native JavaScript `Error`: Returns the error's message property.
 * - Fallback case: Provides a generic error message for unknown or unexpected errors.
 */
export const getErrorMessage = (error: unknown) => {
  if (error instanceof AuthError) {
    return "Wrong credentials or the user did not found.";
  }

  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaKnownError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return "Invalid data provided.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

const handleZodError = (error: ZodError) => {
  const message = fromError(error);
  return message ? message.toString() : "Validation error occurred.";
};

type PrismaError = Prisma.PrismaClientKnownRequestError;

const handlePrismaKnownError = (error: PrismaError) => {
  const errorCode = error.code;
  const mappedMessage = PRISMA_ERROR_CODES.get(errorCode);

  if (mappedMessage) {
    return mappedMessage;
  }

  if (errorCode === "P2002") {
    return handleDuplicateRecordError(error);
  }

  return "A database error occurred.";
};

const handleDuplicateRecordError = (error: PrismaError) => {
  const field = (error.meta?.target as string[])?.[0] || "field";
  return `A record with this ${field} already exists.`;
};
