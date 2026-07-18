import { db } from "@/db";
import { users, farmers, deliveryCompanies, drivers, harvests, logisticsOrders, produceListings, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Seeding Farm2Market database...\n");

  // Clean up existing data (in reverse order of foreign key dependencies)
  await db.delete(produceListings);
  await db.delete(logisticsOrders);
  await db.delete(harvests);
  await db.delete(drivers);
  await db.delete(deliveryCompanies);
  await db.delete(farmers);
  await db.delete(users);

  // ========== ADMIN USER ==========
  console.log("👤 Creating admin user...");
  const [adminUser] = await db.insert(users).values({
    name: "Admin User",
    email: "admin@farm2market.com",
    phone: "+2348000000001",
    passwordHash: await hashPassword("admin123"),
    role: "admin",
    status: "active",
  }).returning();
  console.log(`   ✅ Admin created: ${adminUser.email}\n`);

  // ========== FARMER USER ==========
  console.log("👨‍🌾 Creating farmer user...");
  const [farmerUser] = await db.insert(users).values({
    name: "John Okonkwo",
    email: "farmer@farm2market.com",
    phone: "+2348100000002",
    passwordHash: await hashPassword("farmer123"),
    role: "farmer",
    status: "active",
  }).returning();

  const [farmerProfile] = await db.insert(farmers).values({
    userId: farmerUser.id,
    farmName: "Green Valley Farm",
    farmLocation: "Kano State, Nigeria",
    farmSize: "50 hectares",
    farmType: "mixed",
    totalHarvests: 0,
  }).returning();
  console.log(`   ✅ Farmer created: ${farmerUser.email} (${farmerProfile.farmName})\n`);

  // Create sample harvests for farmer
  console.log("🌾 Creating harvest records...");
  const harvestsData = [
    {
      cropName: "Tomatoes",
      quantity: "5000.00",
      unit: "kg",
      harvestDate: new Date().toISOString().split("T")[0],
      farmLocation: "Green Valley Farm, Kano",
      destinationLocation: "Lagos Market, Ikeja",
      condition: "fresh" as const,
      notes: "Roma tomatoes, premium quality",
    },
    {
      cropName: "Maize (Corn)",
      quantity: "10000.00",
      unit: "kg",
      harvestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      farmLocation: "Green Valley Farm, Kano",
      destinationLocation: "Abuja Food Terminal",
      condition: "good" as const,
      notes: "Yellow maize, dried properly",
    },
    {
      cropName: "Cassava",
      quantity: "15000.00",
      unit: "kg",
      harvestDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      farmLocation: "Green Valley Farm, Kano",
      condition: "good" as const,
      notes: "Freshly harvested cassava tubers",
    },
    {
      cropName: "Bell Peppers",
      quantity: "2000.00",
      unit: "kg",
      harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      farmLocation: "Green Valley Farm, Kano",
      destinationLocation: null,
      condition: "fresh" as const,
      notes: "Mixed colors (green, yellow, red)",
    },
  ];

  const createdHarvests = [];
  for (const h of harvestsData) {
    const [harvest] = await db.insert(harvests).values({
      ...h,
      farmerId: farmerProfile.id,
    }).returning();
    createdHarvests.push(harvest);
  }
  console.log(`   ✅ Created ${createdHarvests.length} harvest records\n`);

  // Create produce listings
  console.log("🛒 Creating produce listings...");
  const listingsData = [
    {
      farmerId: farmerProfile.id,
      produceName: "Fresh Tomatoes",
      quantity: "3000.00",
      unit: "kg",
      pricePerUnit: "2.50",
      location: "Green Valley Farm, Kano State",
      availabilityStatus: "available" as const,
      description: "Premium quality Roma tomatoes, freshly picked daily",
      category: "Vegetables",
      isOrganic: false,
    },
    {
      farmerId: farmerProfile.id,
      produceName: "Yellow Maize",
      quantity: "5000.00",
      unit: "kg",
      pricePerUnit: "1.20",
      location: "Green Valley Farm, Kano State",
      availabilityStatus: "available" as const,
      description: "High-quality yellow corn for flour production",
      category: "Grains",
      isOrganic: true,
    },
    {
      farmerId: farmerProfile.id,
      produceName: "Cassava Tubers",
      quantity: "4000.00",
      unit: "kg",
      pricePerUnit: "0.80",
      location: "Green Valley Farm, Kano State",
      availabilityStatus: "limited" as const,
      description: "Large fresh cassava tubers perfect for garri processing",
      category: "Root Crops",
      isOrganic: true,
    },
  ];

  for (const l of listingsData) {
    await db.insert(produceListings).values(l);
  }
  console.log(`   ✅ Created ${listingsData.length} produce listings\n`);

  // ========== DELIVERY PARTNER ==========
  console.log("🏢 Creating delivery partner...");
  const [partnerUser] = await db.insert(users).values({
    name: "Emeka Adebayo",
    email: "partner@farm2market.com",
    phone: "+2348100000003",
    passwordHash: await hashPassword("partner123"),
    role: "delivery_partner",
    status: "active",
  }).returning();

  const [company] = await db.insert(deliveryCompanies).values({
    userId: partnerUser.id,
    companyName: "FastTrack Logistics Ltd.",
    contactPerson: "Emeka Adebayo",
    address: "45 Logistics Avenue, Ikeja, Lagos",
    fleetSize: 15,
    isActive: true,
    capacityAvailable: true,
    licenseNumber: "LIC-FST-2024-001",
  }).returning();
  console.log(`   ✅ Delivery partner created: ${company.companyName}\n`);

  // ========== DRIVER ==========
  console.log("🚛 Creating driver user...");
  const [driverUser] = await db.insert(users).values({
    name: "Chidi Eze",
    email: "driver@farm2market.com",
    phone: "+2348100000004",
    passwordHash: await hashPassword("driver123"),
    role: "driver",
    status: "active",
  }).returning();

  const [driver] = await db.insert(drivers).values({
    userId: driverUser.id,
    deliveryCompanyId: company.id,
    vehicleType: "truck",
    vehicleNumber: "LSD-4567-XZ",
    licenseNumber: "DL-CHE-2023-112",
    isAvailable: true,
    totalDeliveries: 47,
    rating: "4.85",
  }).returning();
  console.log(`   ✅ Driver created: ${driverUser.name} (${driver.vehicleType})\n`);

  // ========== LOGISTICS ORDERS ==========
  console.log("📦 Creating logistics orders...");
  const ordersData = [
    {
      orderId: "FLM-2024-0015",
      farmerId: farmerProfile.id,
      deliveryCompanyId: company.id,
      driverId: driver.id,
      harvestId: createdHarvests[0].id,
      pickupLocation: "Green Valley Farm, Kano State",
      deliveryLocation: "Ikeja Vegetable Market, Lagos",
      pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      quantity: "5000.00",
      unit: "kg",
      produceDetails: "5000 kg of fresh Roma tomatoes",
      orderStatus: "in_transit" as const,
      driverDecisionStatus: "accepted" as const,
      priceEstimate: "12500.00",
      farmerContact: farmerProfile.farmName,
      deliveryInstructions: "Deliver before 6am for morning market sales",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      orderId: "FLM-2024-0014",
      farmerId: farmerProfile.id,
      deliveryCompanyId: company.id,
      driverId: driver.id,
      harvestId: createdHarvests[1].id,
      pickupLocation: "Green Valley Farm, Kano State",
      deliveryLocation: "Abuja Food Terminal",
      pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      quantity: "10000.00",
      unit: "kg",
      produceDetails: "10000 kg of yellow maize",
      orderStatus: "accepted" as const,
      driverDecisionStatus: "accepted" as const,
      priceEstimate: "18000.00",
      farmerContact: farmerProfile.farmName,
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      orderId: "FLM-2024-0013",
      farmerId: farmerProfile.id,
      deliveryCompanyId: company.id,
      harvestId: createdHarvests[2].id,
      pickupLocation: "Green Valley Farm, Kano",
      deliveryLocation: "Sabo Garri Processing Zone, Lagos",
      quantity: "12000.00",
      unit: "kg",
      produceDetails: "12000 kg of fresh cassava tubers",
      orderStatus: "delivered" as const,
      driverDecisionStatus: "accepted" as const,
      finalPrice: "9600.00",
      farmerContact: farmerProfile.farmName,
      createdAt: new Date(Date.now() - 168 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      orderId: "FLM-2024-0012",
      farmerId: farmerProfile.id,
      deliveryCompanyId: company.id,
      harvestId: createdHarvests[3].id,
      pickupLocation: "Green Valley Farm, Kano",
      deliveryLocation: "Victoria Island Farmers Market, Lagos",
      quantity: "2000.00",
      unit: "kg",
      produceDetails: "2000 kg of mixed bell peppers",
      orderStatus: "pending" as const,
      driverDecisionStatus: "pending" as const,
      priceEstimate: "6000.00",
      farmerContact: farmerProfile.farmName,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      orderId: "FLM-2024-0011",
      farmerId: farmerProfile.id,
      deliveryCompanyId: company.id,
      pickupLocation: "Green Valley Farm, Kano",
      deliveryLocation: "Port Harcourt Fresh Produce Hub",
      quantity: "3500.00",
      unit: "kg",
      produceDetails: "3500 kg of assorted vegetables",
      orderStatus: "delivered" as const,
      driverDecisionStatus: "accepted" as const,
      finalPrice: "14000.00",
      farmerContact: farmerProfile.farmName,
      createdAt: new Date(Date.now() - 240 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  for (const o of ordersData) {
    await db.insert(logisticsOrders).values(o);
  }
  console.log(`   ✅ Created ${ordersData.length} logistics orders\n`);

  // ========== ACTIVITY LOGS ==========
  console.log("📋 Creating activity logs...");
  const activityLogData = [
    { adminId: adminUser.id, action: "Onboarded delivery partner", entityType: "company", entityId: company.id, details: `Created ${company.companyName}` },
    { adminId: adminUser.id, action: "Activated farmer account", entityType: "user", entityId: farmerUser.id, details: `Activated ${farmerUser.name}` },
    { adminId: adminUser.id, action: "Activated driver account", entityType: "user", entityId: driverUser.id, details: `Activated ${driverUser.name}` },
  ];

  for (const log of activityLogData) {
    await db.insert(activityLogs).values({ ...log, createdAt: new Date() });
  }

  console.log("\n✨ Seed completed successfully!");
  console.log("\n🔐 Demo Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🟣 Admin:    admin@farm2market.com / admin123");
  console.log("  🌾 Farmer:   farmer@farm2market.com / farmer123");
  console.log("  🏢 Partner:  partner@farm2market.com / partner123");
  console.log("  🚛 Driver:   driver@farm2market.com / driver123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
