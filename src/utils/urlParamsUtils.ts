
import { z } from "zod";

// Schema for validating URL parameters
const urlParamsSchema = z.object({
  zipCode: z.string()
    .refine(
      (value) => {
        const zipCodeRegex = /^\d{5}$/;
        return zipCodeRegex.test(value);
      }, 
      { 
        message: "Invalid zip code format" 
      }
    )
    .optional(),
  age: z.coerce.number()
    .min(0, "Age must be at least 0")
    .max(150, "Age must be less than 150")
    .optional(),
  annualSalary: z.coerce.number()
    .min(0, "Annual salary must be at least 0")
    .max(999999999, "Annual salary too large")
    .optional()
});

export type ValidUrlParams = z.infer<typeof urlParamsSchema>;

/**
 * Parses and validates URL parameters for insurance quote initialization
 * @returns Validated URL parameters or empty object if invalid
 */
export const parseUrlParams = (): ValidUrlParams => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    // Convert URLSearchParams to a plain object
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    // Validate the params against the schema
    const result = urlParamsSchema.safeParse(params);
    
    if (result.success) {
      console.log("Valid URL parameters:", result.data);
      return result.data;
    } else {
      console.warn("Invalid URL parameters:", result.error);
      return {};
    }
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
    return {};
  }
};
