
import { z } from "zod";

// Individual schemas for each parameter
const zipCodeSchema = z.string()
  .refine(
    (value) => {
      const zipCodeRegex = /^\d{5}$/;
      return zipCodeRegex.test(value);
    }, 
    { 
      message: "Invalid zip code format" 
    }
  );

const ageSchema = z.coerce.number()
  .min(0, "Age must be at least 0")
  .max(150, "Age must be less than 150");

const annualSalarySchema = z.coerce.number()
  .min(0, "Annual salary must be at least 0")
  .max(999999999, "Annual salary too large");

export type ValidUrlParams = {
  zipCode?: string;
  age?: number;
  annualSalary?: number;
};

/**
 * Parses and validates URL parameters for insurance quote initialization
 * @returns Validated URL parameters or empty object if invalid
 */
export const parseUrlParams = (): ValidUrlParams => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const result: ValidUrlParams = {};
    
    // Validate zipCode if present
    const zipCode = searchParams.get('zipCode');
    if (zipCode) {
      const zipCodeResult = zipCodeSchema.safeParse(zipCode);
      if (zipCodeResult.success) {
        result.zipCode = zipCodeResult.data;
      } else {
        console.warn("Invalid zipCode parameter:", zipCodeResult.error);
      }
    }
    
    // Validate age if present
    const age = searchParams.get('age');
    if (age) {
      const ageResult = ageSchema.safeParse(age);
      if (ageResult.success) {
        result.age = ageResult.data;
      } else {
        console.warn("Invalid age parameter:", ageResult.error);
      }
    }
    
    // Validate annualSalary if present
    const annualSalary = searchParams.get('annualSalary');
    if (annualSalary) {
      const annualSalaryResult = annualSalarySchema.safeParse(annualSalary);
      if (annualSalaryResult.success) {
        result.annualSalary = annualSalaryResult.data;
      } else {
        console.warn("Invalid annualSalary parameter:", annualSalaryResult.error);
      }
    }
    
    console.log("Valid URL parameters:", result);
    return result;
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
    return {};
  }
};
