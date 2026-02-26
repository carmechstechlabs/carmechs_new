/**
 * cPanel Startup Wrapper (app.js)
 * 
 * This file is used by cPanel's Node.js Selector (Phusion Passenger) 
 * to boot the TypeScript server using 'tsx'.
 */

async function start() {
  try {
    // Import tsx register to handle .ts files on the fly
    const { register } = await import('tsx/register/node');
    
    // Start the server
    await import('./server.ts');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
