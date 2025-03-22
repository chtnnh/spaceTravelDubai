import {
  User, InsertUser,
  Destination, InsertDestination,
  TravelClass, InsertTravelClass,
  Accommodation, InsertAccommodation,
  Experience, InsertExperience,
  Trip, InsertTrip
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destination methods
  getDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Travel Class methods
  getTravelClasses(): Promise<TravelClass[]>;
  getTravelClass(id: number): Promise<TravelClass | undefined>;
  createTravelClass(travelClass: InsertTravelClass): Promise<TravelClass>;
  
  // Accommodation methods
  getAccommodations(): Promise<Accommodation[]>;
  getAccommodationsByDestination(destinationId: number): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  
  // Experience methods
  getExperiences(): Promise<Experience[]>;
  getExperiencesByDestination(destinationId: number): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  
  // Trip methods
  getTrips(): Promise<Trip[]>;
  getTripsByUser(userId: number): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<Trip>): Promise<Trip | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private travelClasses: Map<number, TravelClass>;
  private accommodations: Map<number, Accommodation>;
  private experiences: Map<number, Experience>;
  private trips: Map<number, Trip>;
  
  private userId: number = 1;
  private destinationId: number = 1;
  private travelClassId: number = 1;
  private accommodationId: number = 1;
  private experienceId: number = 1;
  private tripId: number = 1;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.travelClasses = new Map();
    this.accommodations = new Map();
    this.experiences = new Map();
    this.trips = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.destinationId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  // Travel Class methods
  async getTravelClasses(): Promise<TravelClass[]> {
    return Array.from(this.travelClasses.values());
  }

  async getTravelClass(id: number): Promise<TravelClass | undefined> {
    return this.travelClasses.get(id);
  }

  async createTravelClass(insertTravelClass: InsertTravelClass): Promise<TravelClass> {
    const id = this.travelClassId++;
    const travelClass: TravelClass = { ...insertTravelClass, id };
    this.travelClasses.set(id, travelClass);
    return travelClass;
  }

  // Accommodation methods
  async getAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodationsByDestination(destinationId: number): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(
      accommodation => accommodation.destinationId === destinationId
    );
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.accommodationId++;
    const accommodation: Accommodation = { ...insertAccommodation, id };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getExperiencesByDestination(destinationId: number): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(
      experience => experience.destinationId === destinationId
    );
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.experienceId++;
    const experience: Experience = { ...insertExperience, id };
    this.experiences.set(id, experience);
    return experience;
  }

  // Trip methods
  async getTrips(): Promise<Trip[]> {
    return Array.from(this.trips.values());
  }

  async getTripsByUser(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(
      trip => trip.userId === userId
    );
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.tripId++;
    const trip: Trip = { ...insertTrip, id };
    this.trips.set(id, trip);
    return trip;
  }

  async updateTrip(id: number, tripUpdate: Partial<Trip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = { ...trip, ...tripUpdate };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  // Initialize sample data
  private initializeSampleData() {
    // Destinations
    this.createDestination({
      name: "International Space Station",
      description: "Experience zero gravity and witness 16 sunrises daily as you orbit Earth aboard humanity's outpost in space.",
      type: "ORBITAL",
      imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      distance: 420,
      duration: 10,
      basePrice: 58000
    });

    this.createDestination({
      name: "Lunar Expedition",
      description: "Walk in the footsteps of the Apollo astronauts and experience lunar gravity in our state-of-the-art habitats.",
      type: "LUNAR",
      imageUrl: "https://images.unsplash.com/photo-1514944227608-39256be4ca10?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      distance: 384400,
      duration: 14,
      basePrice: 125000
    });

    this.createDestination({
      name: "Mars Colony Tour",
      description: "Pioneer the Red Planet experience with exclusive access to the first human settlements on another world.",
      type: "PLANETARY",
      imageUrl: "https://images.unsplash.com/photo-1575470522418-b88b692b8b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      distance: 225000000,
      duration: 180,
      basePrice: 350000
    });

    // Travel Classes
    this.createTravelClass({
      name: "Cosmonaut Class",
      description: "Our essential space experience with all the necessities for a comfortable journey beyond Earth.",
      priceMultiplier: 100, // 100% of base price
      features: [
        "Standard cabin accommodations",
        "Basic space food package",
        "Guided tours and activities",
        "Safety and survival training"
      ]
    });

    this.createTravelClass({
      name: "Astronaut Class",
      description: "Enhanced comfort with additional perks for a more personalized space adventure.",
      priceMultiplier: 150, // 150% of base price
      features: [
        "Premium cabin with window views",
        "Gourmet space cuisine options",
        "Priority scheduling for activities",
        "Exclusive EVA experience (spacewalk)",
        "Advanced space photography kit"
      ]
    });

    this.createTravelClass({
      name: "Pioneer Class",
      description: "The ultimate luxury space experience with exclusive amenities and personalized service.",
      priceMultiplier: 250, // 250% of base price
      features: [
        "Luxury suite with panoramic views",
        "Private chef and custom menu",
        "Private space exploration missions",
        "Extended EVA sessions with 3D recording",
        "Dedicated space concierge service",
        "Post-flight VIP recovery program"
      ]
    });

    // Accommodations
    this.createAccommodation({
      name: "Aurora Orbital Hotel",
      description: "Experience luxury accommodation in Earth's orbit with panoramic views of our planet and the endless cosmos.",
      destinationId: 1, // ISS
      imageUrl: "https://images.unsplash.com/photo-1517394834181-95ed159986c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      capacity: 36,
      size: 400,
      pricePerNight: 12500,
      amenities: ["Quantum Wi-Fi", "Gourmet dining"]
    });

    this.createAccommodation({
      name: "Tranquility Lunar Base",
      description: "Stay in our flagship lunar habitat located near the historic Apollo landing sites, featuring Earth views and lunar excursions.",
      destinationId: 2, // Moon
      imageUrl: "https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      capacity: 24,
      size: 650,
      pricePerNight: 18000,
      amenities: ["1/6 Earth gravity", "Rover access"]
    });

    this.createAccommodation({
      name: "Olympus Mars Habitat",
      description: "Our premier Martian colony at the base of Olympus Mons, featuring revolutionary terraformed gardens and red planet exploration.",
      destinationId: 3, // Mars
      imageUrl: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      capacity: 18,
      size: 800,
      pricePerNight: 26000,
      amenities: ["Terraformed garden", "Volcano views"]
    });

    this.createAccommodation({
      name: "Cosmos Luxury Space Yacht",
      description: "Our private space yacht offers the ultimate in luxury space travel. Chart your own course with a full crew at your service.",
      destinationId: 1, // Can be used for any destination
      imageUrl: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      capacity: 8,
      size: 350,
      pricePerNight: 55000,
      amenities: ["Premium bar", "Custom itinerary"]
    });

    // Experiences
    this.createExperience({
      name: "Zero-G Floating",
      description: "Experience true weightlessness in our specially designed zero gravity chambers. Float freely as astronauts do in space!",
      destinationId: 1, // ISS
      imageUrl: "https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      duration: 90, // 90 minutes
      price: 8500
    });

    this.createExperience({
      name: "Guided Space Walk",
      description: "Step outside the spacecraft in our cutting-edge EVA suits for an unforgettable view of Earth or other celestial bodies.",
      destinationId: 1, // ISS
      imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      duration: 120, // 2 hours
      price: 25000
    });

    this.createExperience({
      name: "Lunar Rover Expedition",
      description: "Explore the lunar surface in our advanced rovers. Visit historic Apollo landing sites and undiscovered territory.",
      destinationId: 2, // Moon
      imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      duration: 240, // 4 hours
      price: 15000
    });

    this.createExperience({
      name: "Advanced Astrophotography",
      description: "Capture breathtaking images of space with our professional-grade equipment and guidance from expert photographers.",
      destinationId: 1, // ISS but can be used for any destination
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      duration: 180, // 3 hours
      price: 5800
    });

    this.createExperience({
      name: "Martian Geology Expedition",
      description: "Join scientists on a geological survey of Mars. Collect samples and discover the planet's ancient secrets.",
      destinationId: 3, // Mars
      imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      duration: 480, // 8 hours
      price: 18500
    });

    this.createExperience({
      name: "Molecular Gastronomy in Space",
      description: "Experience a multi-course fine dining experience prepared by renowned chefs, specially crafted for zero-G environments.",
      destinationId: 1, // ISS
      imageUrl: "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      duration: 120, // 2 hours
      price: 3200
    });
  }
}

export const storage = new MemStorage();
