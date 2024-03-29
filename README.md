This is an open source online bookstore application for my own learning purpose.  The application has the following features:
- Search/filter by categories and price range
- Shopping cart
- Paypal and credit card payment implemented with Braintree
- OAuth2 authentication

Please feel free to take a look at the code if you are interested.

To get started on a local development environment, run

```
docker-compose -f docker-compose.dev.local.yml up --build
```

The application can then be accessed on your local web browser on localhost.

The application uses the nextjs/expressjs/nginx/mongo and makes use of the following software topics.  If you are new to any of the following topics and wish to look for an example of how to implement, feel free to take a look at my code.
- nextjs (a frontend framework built on top of reactjs that provides a bunch of additional benefits like image optimization and hybrid SSG and SSR (Pre-render pages at build time (SSG) or request time (SSR) in a single project)
   - See https://nextjs.org/ for a complete list of features offered by nextjs
- use of hybrid SSG (static site generation) in this webapp
- expressjs
- mongodb
- docker and docker-compose
- travis CI (see the .travis.yml file for my implementation of a CI pipeline with docker)
- dependency injection on the server code
- paypal and credit card payment implemented with Braintree
- Unit testing and end-to-end testng with mocha, jest, react-testing-library, and supertest.
- nginx (covers the following concepts:
   - configuring nginx as reverse proxy
   - client-side caching with Expires directive
   - compression with gzip and brotli
   - microcaching to cache dynamic content with proxy_cache_path directive
   - https
   - http2 (not implemented yet)
   - rate limiting with limit_req and limit_req_zone directives
   - caching with cache-control directive
