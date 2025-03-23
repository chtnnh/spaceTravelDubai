export interface Env {
	// Define your environment variables here
}

// Define ExecutionContext interface if not provided by Cloudflare Workers types
export interface ExecutionContext {
	waitUntil(promise: Promise<any>): void;
	passThroughOnException(): void;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		
		// Handle CORS preflight requests
		if (request.method === "OPTIONS") {
			return handleCorsRequest();
		}
		
		// Only process API requests
		if (!url.pathname.startsWith('/api/')) {
			return new Response('Not Found', { status: 404 });
		}
		
		// Process requests directly instead of proxying
		const path = url.pathname;
		
		// Route to the appropriate handler
		if (path.startsWith('/api/destinations')) {
			return handleDestinationsRequest(request);
		} else if (path.startsWith('/api/travel-classes')) {
			return handleTravelClassesRequest(request);
		} else if (path.startsWith('/api/auth')) {
			return handleAuthRequest(request, path);
		} else if (path.startsWith('/api/accommodations')) {
			return handleAccommodationsRequest(request);
		} else if (path.startsWith('/api/experiences')) {
			return handleExperiencesRequest(request);
		} else if (path.startsWith('/api/trips')) {
			return handleTripsRequest(request, path);
		}
		// Add other routes as needed
		
		return new Response('Not Found', { status: 404 });
	}
};

// Helper for CORS preflight requests
function handleCorsRequest() {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Max-Age": "86400"
		}
	});
}

// Implement your handlers
async function handleDestinationsRequest(request) {
	// Return destination data
	const destinations = [
		{
			id: 1,
			name: "International Space Station",
			description: "Experience zero gravity and witness 16 sunrises daily as you orbit Earth aboard humanity's outpost in space.",
			type: "ORBITAL",
			imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			distance: 420,
			duration: 10,
			basePrice: 58000
		},
		{
			id: 2,
			name: "Lunar Expedition",
			description: "Walk in the footsteps of the Apollo astronauts and experience lunar gravity in our state-of-the-art habitats.",
			type: "LUNAR",
			imageUrl: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			distance: 384400,
			duration: 14,
			basePrice: 125000
		},
		{
			id: 3,
			name: "Mars Colony Tour",
			description: "Pioneer the Red Planet experience with exclusive access to the first human settlements on another world.",
			type: "PLANETARY",
			imageUrl: "https://images.unsplash.com/photo-1545156521-77bd85671d30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			distance: 225000000,
			duration: 180,
			basePrice: 350000
		}
	];
	
	return jsonResponse(destinations);
}

async function handleTravelClassesRequest(request) {
	const travelClasses = [
		{
			id: 1,
			name: "Cosmonaut Class",
			description: "Our essential space experience with all the necessities for a comfortable journey beyond Earth.",
			priceMultiplier: 100, // 100% of base price
			features: [
				"Standard cabin accommodations",
				"Basic space food package",
				"Guided tours and activities",
				"Safety and survival training"
			]
		},
		{
			id: 2,
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
		},
		{
			id: 3,
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
		}
	];
	
	return jsonResponse(travelClasses);
}

async function handleAuthRequest(request, path) {
	// Mock user data
	const mockUser = {
		id: 1,
		username: "spaceexplorer",
		email: "explorer@space.travel",
		fullName: "Alex Astronaut",
		preferences: { theme: "dark", notifications: true }
	};
	
	// Handle different auth endpoints
	if (path.includes('/api/auth/user')) {
		// In a real app, you'd check for a valid session/token
		// For demo, we'll return the mock user
		if (request.method === 'GET') {
			return jsonResponse(mockUser);
		}
	} else if (path.includes('/api/auth/login')) {
		if (request.method === 'POST') {
			try {
				// In a real app, you'd validate credentials
				// For demo, we'll just return success
				return jsonResponse(mockUser);
			} catch (error) {
				return jsonResponse({ message: "Invalid credentials" }, 401);
			}
		}
	} else if (path.includes('/api/auth/register')) {
		if (request.method === 'POST') {
			try {
				// In a real app, you'd create a new user
				// For demo, we'll just return success
				return jsonResponse(mockUser, 201);
			} catch (error) {
				return jsonResponse({ message: "Error creating user" }, 500);
			}
		}
	} else if (path.includes('/api/auth/logout')) {
		if (request.method === 'POST') {
			// In a real app, you'd invalidate the session
			return jsonResponse({ message: "Logged out successfully" });
		}
	}
	
	return jsonResponse({ message: "Auth endpoint not implemented" }, 501);
}

async function handleAccommodationsRequest(request) {
	// Return accommodation data
	const accommodations = [
		{
			id: 1,
			name: "Aurora Orbital Hotel",
			description: "Experience luxury accommodation in Earth's orbit with panoramic views of our planet and the endless cosmos.",
			destinationId: 1, // ISS
			imageUrl: "https://images.unsplash.com/photo-1517394834181-95ed159986c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			capacity: 36,
			size: 400,
			pricePerNight: 12500,
			amenities: ["Quantum Wi-Fi", "Gourmet dining"]
		},
		{
			id: 2,
			name: "Tranquility Lunar Base",
			description: "Stay in our flagship lunar habitat located near the historic Apollo landing sites, featuring Earth views and lunar excursions.",
			destinationId: 2, // Moon
			imageUrl: "https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			capacity: 24,
			size: 650,
			pricePerNight: 18000,
			amenities: ["1/6 Earth gravity", "Rover access"]
		},
		{
			id: 3,
			name: "Olympus Mars Habitat",
			description: "Our premier Martian colony at the base of Olympus Mons, featuring revolutionary terraformed gardens and red planet exploration.",
			destinationId: 3, // Mars
			imageUrl: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			capacity: 18,
			size: 800,
			pricePerNight: 26000,
			amenities: ["Terraformed garden", "Volcano views"]
		},
		{
			id: 4,
			name: "Cosmos Luxury Space Yacht",
			description: "Our private space yacht offers the ultimate in luxury space travel. Chart your own course with a full crew at your service.",
			destinationId: 1, // Can be used for any destination
			imageUrl: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			capacity: 8,
			size: 350,
			pricePerNight: 55000,
			amenities: ["Premium bar", "Custom itinerary"]
		}
	];
	
	return jsonResponse(accommodations);
}

async function handleExperiencesRequest(request) {
	const experiences = [
		{
			id: 1,
			name: "Zero-G Floating",
			description: "Experience true weightlessness in our specially designed zero gravity chambers. Float freely as astronauts do in space!",
			destinationId: 1, // ISS
			imageUrl: "https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			duration: 90, // 90 minutes
			price: 8500
		},
		{
			id: 2,
			name: "Guided Space Walk",
			description: "Step outside the spacecraft in our cutting-edge EVA suits for an unforgettable view of Earth or other celestial bodies.",
			destinationId: 1, // ISS
			imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			duration: 120, // 2 hours
			price: 25000
		},
		{
			id: 3,
			name: "Lunar Rover Expedition",
			description: "Explore the lunar surface in our advanced rovers. Visit historic Apollo landing sites and undiscovered territory.",
			destinationId: 2, // Moon
			imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			duration: 240, // 4 hours
			price: 15000
		},
		{
			id: 4,
			name: "Advanced Astrophotography",
			description: "Capture breathtaking images of space with our professional-grade equipment and guidance from expert photographers.",
			destinationId: 1, // ISS but can be used for any destination
			imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			duration: 180, // 3 hours
			price: 5800
		},
		{
			id: 5,
			name: "Martian Geology Expedition",
			description: "Join scientists on a geological survey of Mars. Collect samples and discover the planet's ancient secrets.",
			destinationId: 3, // Mars
			imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			duration: 480, // 8 hours
			price: 18500
		}
	];
	
	return jsonResponse(experiences);
}

async function handleTripsRequest(request, path) {
	// Mock user ID for demo purposes
	const demoUserId = 1;
	
	if (request.method === 'GET') {
		// GET /api/trips - Return user trips
		const mockTrips = [
			{
				id: 1,
				userId: demoUserId,
				destinationId: 1,
				travelClassId: 2,
				accommodationId: 1,
				departureDate: "2025-04-15T00:00:00.000Z",
				returnDate: "2025-04-25T00:00:00.000Z",
				totalPrice: 198500,
				status: "booked",
				bookedExperiences: [1, 2]
			},
			{
				id: 2,
				userId: demoUserId,
				destinationId: 2,
				travelClassId: 3,
				accommodationId: 2,
				departureDate: "2025-07-10T00:00:00.000Z",
				returnDate: "2025-07-24T00:00:00.000Z",
				totalPrice: 452000,
				status: "booked",
				bookedExperiences: [3, 4]
			}
		];
		
		// If a specific trip ID is requested
		const tripMatch = path.match(/\/api\/trips\/(\d+)/);
		if (tripMatch) {
			const tripId = parseInt(tripMatch[1]);
			const trip = mockTrips.find(t => t.id === tripId);
			if (trip) {
				return jsonResponse(trip);
			}
			return jsonResponse({ message: "Trip not found" }, 404);
		}
		
		return jsonResponse(mockTrips);
	} else if (request.method === 'POST') {
		// Create a new trip
		try {
			// For simplicity, we'll just return a success message
			// In a real app, you'd parse the request body and create a trip
			return jsonResponse({ 
				message: "Trip created successfully",
				id: 3 // Mock new trip ID
			}, 201);
		} catch (error) {
			return jsonResponse({ message: "Error creating trip" }, 500);
		}
	}
	
	// Method not supported
	return jsonResponse({ message: "Method not allowed" }, 405);
}

// Helper for JSON responses with CORS headers
function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
