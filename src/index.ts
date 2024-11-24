import { Hono } from 'hono';

const app = new Hono();
let messages: string[] = []; // Store messages

// Serve the main `index.html` for the root route
app.get('/', async (c) => {
  try {
    const html = await Bun.file('./public/index.html').text(); // Serve the HTML file
    return c.html(html); // Return HTML
  } catch (e) {
    console.error('Error serving index.html:', e);
    return c.text('Internal Server Error', 500); // Handle errors
  }
});

// POST /api/message to store a new message
app.post('/api/message', async (c) => {
  try {
    const body = await c.req.json(); // Parse the incoming JSON body
    const { message } = body; // Extract the message from the body

    // Check if the message is valid (non-empty)
    if (message && message.trim() !== '') {
      messages.push(message); // Store the message in the array
      return c.json({ messages }); // Send back the updated list of messages
    } else {
      return c.json({ error: 'Message cannot be empty' }, 400); // Return error if the message is empty
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return c.json({ error: 'Invalid JSON format' }, 400); // Handle invalid JSON format
  }
});

// GET /api/messages endpoint to return all stored messages
app.get('/api/messages', (c) => {
  return c.json({ messages }); // Return the list of messages in JSON format
});

// Start the server with Bun
Bun.serve({
  fetch: app.fetch,
  port: 3000, // Server runs on port 3000
  development: true,
});

console.log('Server running at http://localhost:3000');
