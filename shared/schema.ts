import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  preferences: jsonb("preferences").default({}).notNull()
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // ORBITAL, LUNAR, PLANETARY
  imageUrl: text("image_url").notNull(),
  distance: integer("distance").notNull(), // in km
  duration: integer("duration").notNull(), // in days
  basePrice: integer("base_price").notNull() // in USD
});

export const travelClasses = pgTable("travel_classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceMultiplier: integer("price_multiplier").notNull(), // percentage multiplier for the base price
  features: jsonb("features").default([]).notNull()
});

export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  destinationId: integer("destination_id").notNull(),
  imageUrl: text("image_url").notNull(),
  capacity: integer("capacity").notNull(),
  size: integer("size").notNull(), // in sq meters
  pricePerNight: integer("price_per_night").notNull(), // in USD
  amenities: jsonb("amenities").default([]).notNull()
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  destinationId: integer("destination_id").notNull(),
  imageUrl: text("image_url").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in USD
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  destinationId: integer("destination_id").notNull(),
  travelClassId: integer("travel_class_id").notNull(),
  accommodationId: integer("accommodation_id").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("booked"), // booked, in-progress, completed, cancelled
  bookedExperiences: jsonb("booked_experiences").default([]).notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  preferences: true,
});

export const insertDestinationSchema = createInsertSchema(destinations);
export const insertTravelClassSchema = createInsertSchema(travelClasses);
export const insertAccommodationSchema = createInsertSchema(accommodations);
export const insertExperienceSchema = createInsertSchema(experiences);
export const insertTripSchema = createInsertSchema(trips);

// Login schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types for all schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertTravelClass = z.infer<typeof insertTravelClassSchema>;
export type TravelClass = typeof travelClasses.$inferSelect;

export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export type LoginCredentials = z.infer<typeof loginSchema>;
