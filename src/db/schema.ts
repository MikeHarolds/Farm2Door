import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userRoles = ["farmer", "delivery_partner", "driver", "admin"] as const;
export const userStatuses = ["active", "inactive", "pending"] as const;
export const harvestConditions = ["fresh", "good", "fair", "needs_processing"] as const;
export const orderStatuses = [
  "pending",
  "assigned",
  "accepted",
  "en_route_to_pickup",
  "picked_up",
  "in_transit",
  "delivered",
  "failed",
  "cancelled",
] as const;
export const driverDecisions = ["pending", "accepted", "rejected"] as const;
export const availabilityStatuses = ["available", "sold_out", "limited"] as const;

const timestamps = {
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
};

// Base authentication users.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: userRoles }).notNull(),
  status: text("status", { enum: userStatuses }).notNull().default("active"),
  ...timestamps,
});

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  farmName: text("farm_name").notNull(),
  farmLocation: text("farm_location").notNull(),
  farmSize: text("farm_size"),
  farmType: text("farm_type"),
  description: text("description"),
  totalHarvests: integer("total_harvests").default(0),
  ...timestamps,
});

export const deliveryCompanies = pgTable("delivery_companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  address: text("address"),
  fleetSize: integer("fleet_size").default(0),
  operatingAreas: text("operating_areas"),
  licenseNumber: text("license_number"),
  isActive: boolean("is_active").default(true),
  capacityAvailable: boolean("capacity_available").default(true),
  ...timestamps,
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  deliveryCompanyId: integer("delivery_company_id").references(() => deliveryCompanies.id, {
    onDelete: "set null",
  }),
  vehicleType: text("vehicle_type"),
  vehicleNumber: text("vehicle_number"),
  licenseNumber: text("license_number"),
  currentLocation: text("current_location"),
  isAvailable: boolean("is_available").default(true),
  // Stored as text to preserve the existing API shape and decimal precision.
  rating: text("rating").default("0.00"),
  totalDeliveries: integer("total_deliveries").default(0),
  ...timestamps,
});

export const harvests = pgTable("harvests", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id")
    .references(() => farmers.id, { onDelete: "cascade" })
    .notNull(),
  cropName: text("crop_name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit").notNull(),
  harvestDate: text("harvest_date").notNull(),
  farmLocation: text("farm_location").notNull(),
  destinationLocation: text("destination_location"),
  condition: text("condition", { enum: harvestConditions }).notNull().default("fresh"),
  notes: text("notes"),
  status: text("status").default("available"),
  ...timestamps,
});

export const logisticsOrders = pgTable("logistics_orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").unique().notNull(),
  farmerId: integer("farmer_id")
    .references(() => farmers.id, { onDelete: "cascade" })
    .notNull(),
  deliveryCompanyId: integer("delivery_company_id").references(() => deliveryCompanies.id, {
    onDelete: "set null",
  }),
  driverId: integer("driver_id").references(() => drivers.id, { onDelete: "set null" }),
  harvestId: integer("harvest_id").references(() => harvests.id, { onDelete: "set null" }),
  pickupLocation: text("pickup_location").notNull(),
  deliveryLocation: text("delivery_location").notNull(),
  pickupDate: text("pickup_date"),
  deliveryDate: text("delivery_date"),
  quantity: text("quantity").notNull(),
  unit: text("unit").notNull(),
  produceDetails: text("produce_details"),
  orderStatus: text("order_status", { enum: orderStatuses }).notNull().default("pending"),
  driverDecisionStatus: text("driver_decision_status", { enum: driverDecisions })
    .notNull()
    .default("pending"),
  priceEstimate: text("price_estimate"),
  finalPrice: text("final_price"),
  farmerContact: text("farmer_contact"),
  notes: text("notes"),
  deliveryInstructions: text("delivery_instructions"),
  cancelledReason: text("cancelled_reason"),
  failureReason: text("failure_reason"),
  ...timestamps,
});

export const produceListings = pgTable("produce_listings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id")
    .references(() => farmers.id, { onDelete: "cascade" })
    .notNull(),
  produceName: text("produce_name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit").notNull(),
  pricePerUnit: text("price_per_unit").notNull(),
  location: text("location").notNull(),
  availabilityStatus: text("availability_status", { enum: availabilityStatuses })
    .notNull()
    .default("available"),
  description: text("description"),
  image: text("image"),
  isOrganic: boolean("is_organic").default(false),
  category: text("category"),
  ...timestamps,
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});
