import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import * as crypto from "crypto";
import { loginSchema, insertUserSchema, insertTripSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "celestial-voyages-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
    })
  );

  // Set up passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // In a real app, we would hash the password
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Validate request body middleware
  const validateBody = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: validationError.message });
        } else {
          res.status(400).json({ message: "Invalid request body" });
        }
      }
    };
  };

  // Auth routes
  app.post("/api/auth/login", validateBody(loginSchema), (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ 
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          preferences: user.preferences
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/register", validateBody(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const newUser = await storage.createUser(req.body);
      
      // Log the user in after registration
      req.logIn(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json({ 
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          preferences: newUser.preferences
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.status(200).json({ 
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        preferences: user.preferences
      });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(function(err) {
      if (err) { return res.status(500).json({ message: "Error during logout" }); }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Destinations routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.status(200).json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(parseInt(req.params.id));
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.status(200).json(destination);
    } catch (error) {
      res.status(500).json({ message: "Error fetching destination" });
    }
  });

  // Travel Classes routes
  app.get("/api/travel-classes", async (req, res) => {
    try {
      const travelClasses = await storage.getTravelClasses();
      res.status(200).json(travelClasses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travel classes" });
    }
  });

  app.get("/api/travel-classes/:id", async (req, res) => {
    try {
      const travelClass = await storage.getTravelClass(parseInt(req.params.id));
      if (!travelClass) {
        return res.status(404).json({ message: "Travel class not found" });
      }
      res.status(200).json(travelClass);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travel class" });
    }
  });

  // Accommodations routes
  app.get("/api/accommodations", async (req, res) => {
    try {
      let accommodations;
      if (req.query.destinationId) {
        accommodations = await storage.getAccommodationsByDestination(parseInt(req.query.destinationId as string));
      } else {
        accommodations = await storage.getAccommodations();
      }
      res.status(200).json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accommodations" });
    }
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      const accommodation = await storage.getAccommodation(parseInt(req.params.id));
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.status(200).json(accommodation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accommodation" });
    }
  });

  // Experiences routes
  app.get("/api/experiences", async (req, res) => {
    try {
      let experiences;
      if (req.query.destinationId) {
        experiences = await storage.getExperiencesByDestination(parseInt(req.query.destinationId as string));
      } else {
        experiences = await storage.getExperiences();
      }
      res.status(200).json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Error fetching experiences" });
    }
  });

  app.get("/api/experiences/:id", async (req, res) => {
    try {
      const experience = await storage.getExperience(parseInt(req.params.id));
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      res.status(200).json(experience);
    } catch (error) {
      res.status(500).json({ message: "Error fetching experience" });
    }
  });

  // Trips routes - protected by authentication
  app.get("/api/trips", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const trips = await storage.getTripsByUser(user.id);
      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trips" });
    }
  });

  app.get("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      const trip = await storage.getTrip(parseInt(req.params.id));
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      // Check if the trip belongs to the user
      const user = req.user as any;
      if (trip.userId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.status(200).json(trip);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trip" });
    }
  });

  app.post("/api/trips", isAuthenticated, validateBody(insertTripSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const tripData = { ...req.body, userId: user.id };
      const newTrip = await storage.createTrip(tripData);
      res.status(201).json(newTrip);
    } catch (error) {
      res.status(500).json({ message: "Error creating trip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
