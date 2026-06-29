/**
 * Validation utilities for request parameters
 */

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate required fields
 */
export function validateRequired(
  obj: Record<string, unknown>,
  fields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    const value = obj[field];
    if (value === undefined || value === null || value === '') {
      errors.push({
        field,
        message: `Field '${field}' is required`,
      });
    }
  }

  return errors;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic check)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic check: should be at least 10 digits
  const phoneRegex = /^\+?[\d\s()-]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Throw validation error if errors exist
 */
export function throwIfValidationErrors(errors: ValidationError[]): void {
  if (errors.length > 0) {
    const messages = errors.map((e) => `${e.field}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${messages}`);
  }
}

