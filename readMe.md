# Rate Limiting with Redis and Express

This project demonstrates how to implement rate limiting in a Node.js Express application using Redis as a caching mechanism. It provides IP-based and endpoint-based rate limiting to restrict the number of requests per IP address and per endpoint respectively.

## Prerequisites

- Node.js installed
- Redis server running locally or on a remote server

## Set up the Redis connection:
- If your Redis server is running locally, you can use the default configuration.
- If your Redis server is running on a remote server or has custom configurations, modify the Redis connection settings in app.js accordingly.

## Usage
The application provides two types of rate limiting: IP-based rate limiting and endpoint-based rate limiting.

# IP-based Rate Limiting
IP-based rate limiting restricts the number of requests per IP address. The default configuration allows a maximum of 100 requests per IP address within a time window of 60 seconds.

To apply IP-based rate limiting to all routes, use the ipRateLimit middleware in `index.js`:

``` js
app.use(ipRateLimit);

```

# Endpoint-based Rate Limiting
Endpoint-based rate limiting restricts the number of requests per endpoint. The default configuration allows a maximum of 50 requests per endpoint within a time window of 60 seconds.

To apply endpoint-based rate limiting to specific routes, use the endpointRateLimit middleware in `index.js`:
```js
app.get('/api/data', endpointRateLimit, (req, res) => {
  // Your route logic here
});

```

## Error Handling
If there are any errors with the Redis connection or any other internal server errors, appropriate error messages will be sent with the corresponding HTTP status codes.