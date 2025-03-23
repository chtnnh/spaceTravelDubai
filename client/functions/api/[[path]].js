// This is a catch-all API handler for Cloudflare Pages Functions
export async function onRequest(context) {
    // Get the request path (e.g., /api/destinations)
    const url = new URL(context.request.url);
    const path = url.pathname;

    // Forward the request to your backend API
    const apiUrl = `https://your-backend-api-url.com${path}`;

    console.log(`Forwarding request to: ${apiUrl}`);

    try {
        // Forward the request with the same method, headers, and body
        const response = await fetch(apiUrl, {
            method: context.request.method,
            headers: context.request.headers,
            body: context.request.method !== 'GET' && context.request.method !== 'HEAD'
                ? await context.request.clone().arrayBuffer()
                : undefined,
        });

        // Return the response from your API
        const responseData = await response.text();

        return new Response(responseData, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error(`API request failed: ${error.message}`);
        return new Response(JSON.stringify({ error: 'Failed to reach API server' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
} 