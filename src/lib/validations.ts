import { z } from "zod";

// Registration validation schemas
export const farmerRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  farmName: z.string().min(2, "Farm name is required"),
  farmLocation: z.string().min(5, "Farm location is required"),
  farmSize: z.string().optional(),
  farmType: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const deliveryPartnerRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().optional(),
  address: z.string().optional(),
  licenseNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const driverRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  deliveryCompanyId: z.coerce.number().optional(), // Optional - can join later
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Harvest schemas
export const harvestSchema = z.object({
  cropName: z.string().min(1, "Crop name is required").max(255),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  farmLocation: z.string().min(1, "Farm location is required"),
  destinationLocation: z.string().optional(),
  condition: z.enum(["fresh", "good", "fair", "needs_processing"]).default("fresh"),
  notes: z.string().optional(),
});

// Logistics order schema
export const logisticsOrderSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup location is required"),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  pickupDate: z.string().optional(),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  produceDetails: z.string().optional(),
  notes: z.string().optional(),
  deliveryInstructions: z.string().optional(),
});

// Produce listing schema
export const produceListingSchema = z.object({
  produceName: z.string().min(1, "Produce name is required").max(255),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.coerce.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required"),
  availabilityStatus: z.enum(["available", "sold_out", "limited"]).default("available"),
  description: z.string().optional(),
  category: z.string().optional(),
  isOrganic: z.boolean().default(false),
});

// Types
export type FarmerRegistrationInput = z.infer<typeof farmerRegistrationSchema>;
export type DeliveryPartnerRegistrationInput = z.infer<typeof deliveryPartnerRegistrationSchema>;
export type DriverRegistrationInput = z.infer<typeof driverRegistrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type HarvestInput = z.infer<typeof harvestSchema>;
export type LogisticsOrderInput = z.infer<typeof logisticsOrderSchema>;
export type ProduceListingInput = z.infer<typeof produceListingSchema>;
