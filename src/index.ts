import { Hono } from 'hono';

const app = new Hono();

// API route that sends a response to HTMX
app.get('/api/message', (c) => {
  return c.html('<p>HTMX response: You successfully fetched the message from the server!</p>');
});

// Serve the main index.html for the root route
app.get('/', async (c) => {
  const html = await Bun.file('./public/index.html').text();
  return c.html(html);
});

// Start the server
Bun.serve({
  fetch: app.fetch,
  port: 3000,
  development: true,
});

console.log('Server running at http://localhost:3000');
