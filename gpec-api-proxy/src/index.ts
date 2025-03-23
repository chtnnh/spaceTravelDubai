export interface Env {
	// Define your environment variables here
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		
		// Only handle API requests
		if (!url.pathname.startsWith('/api/')) {
			return new Response('Not Found', { status: 404 });
		}
		
		// Target your actual backend API
		const backendUrl = 'https://your-backend-server.com';
		const apiPath = url.pathname;
		const targetUrl = `${backendUrl}${apiPath}`;
		
		console.log(`Proxying request to: ${targetUrl}`);
		
		// Clone the original request with modifications
		const requestInit: RequestInit = {
			method: request.method,
			headers: new Headers(request.headers),
		};
		
		// Add body for non-GET/HEAD requests
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			requestInit.body = await request.clone().arrayBuffer();
		}
		
		try {
			// Forward the request to your backend
			const response = await fetch(targetUrl, requestInit);
			
			// Clone the response to modify headers
			const responseInit = {
				status: response.status,
				statusText: response.statusText,
				headers: new Headers(response.headers)
			};
			
			// Set CORS headers
			responseInit.headers.set('Access-Control-Allow-Origin', '*');
			responseInit.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
			responseInit.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
			
			// Return the modified response
			return new Response(response.body, responseInit);
		} catch (error) {
			// Handle errors
			console.error(`Failed to reach API: ${error}`);
			return new Response(
				JSON.stringify({ error: 'Failed to reach API server' }),
				{
					status: 502,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
		}
	},
};
