const express = require('express');
const Redis = require('ioredis');

const app = express();
const redis = new Redis(); // Create a Redis connection

// IP-based rate limiting middleware
function ipRateLimit(req, res, next) {
  const maxRequests = 10; // Maximum allowed requests per IP
  const timeWindow = 60 * 1000; // Time window in milliseconds (e.g., 60 seconds)

  // Get the client's IP address
  const clientIP = req.ip;

  // Create a unique key for the client's IP address
  const key = `rate_limit:ip:${clientIP}`;

  // Get the current request count for the client's IP from Redis
  redis.get(key, (err, requestCount) => {
    if (err) {
      console.error('Redis error:', err);
      return res.status(500).send('Internal Server Error');
    }

    // If the request count doesn't exist or has expired, initialize it
    if (!requestCount) {
      requestCount = 1;
      redis.set(key, requestCount, 'PX', timeWindow);
    } else {
      // If the request count exists, increment it
      requestCount = parseInt(requestCount) + 1;
      // If the request count exists, increment it
      requestCount = parseInt(requestCount) + 1;
      if (requestCount <= maxRequests) {
        redis.set(key, requestCount);
      } else {
        const expireTime = 120000; //2minutes
        // Set expiration time to reset the request count
        redis.set(key, requestCount, 'PX', expireTime);
      }
    }

    // Check if the request count exceeds the maximum allowed requests
    if (requestCount > maxRequests) {
      return res.status(429).send('IP rate limit exceeded. Please try again later.');
    }

    // Proceed to the next middleware if rate limit is not exceeded
    next();
  });
}

// Endpoint-based rate limiting middleware
function endpointRateLimit(req, res, next) {
  const maxRequests = 10; // Maximum allowed requests per endpoint
  const timeWindow = 60 * 1000; // Time window in milliseconds (e.g., 60 seconds)

  // Get the endpoint URL
  const endpoint = req.path;

  // Create a unique key for the endpoint
  const key = `rate_limit:endpoint:${endpoint}`;

  // Get the current request count for the endpoint from Redis
  redis.get(key, (err, requestCount) => {
    if (err) {
      console.error('Redis error:', err);
      return res.status(500).send('Internal Server Error');
    }

    // If the request count doesn't exist or has expired, initialize it
    if (!requestCount) {
      requestCount = 1;
      redis.set(key, requestCount, 'PX', timeWindow);
    } else {
      // If the request count exists, increment it
      requestCount = parseInt(requestCount) + 1;
      if (requestCount <= maxRequests) {
        redis.set(key, requestCount);
      } else {
        const expireTime = 120000; //2minutes
        // Set expiration time to reset the request count
        redis.set(key, requestCount, 'PX', expireTime);
      }
    }

    // Check if the request count exceeds the maximum allowed requests
    if (requestCount > maxRequests) {
      return res.status(429).send('Endpoint rate limit exceeded. Please try again later.');
    }

    // Proceed to the next middleware if rate limit is not exceeded
    next();
  });
}

// Apply IP-based rate limiting middleware to all routes => global  rate limiting
app.use(ipRateLimit);

app.get('/api/endpoint', endpointRateLimit, (req, res) => {
  res.send('This is the protected endpoint.');
})

// Apply endpoint-based rate limiting middleware to specific routes
app.get('/api/data', endpointRateLimit, (req, res) => {
  res.send('This is the protected API route.');
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
