This is an open source online bookstore application for my own learning purpose.  Please feel free to take a look at the code if you are interested.

The application uses the nextjs/expressjs/nginx/mongo and makes use of the following software topics.  If you are new to any of the following topics and wish to look for an example of how to implement, feel free to take a look at my code.
- nextjs (a frontend framework built on top of reactjs that provides a bunch of additional benefits like hybrid SSG and SSR (Pre-render pages at build time (SSG) or request time (SSR) in a single project)
   - See https://nextjs.org/ for a complete list of features offered by nextjs
- expressjs
- mongodb
- docker and docker-compose
- travis CI (see the .travis.yml file for my implementation of a CI pipeline with docker)
- dependency injection on the server code
- nginx (covers the following concepts:
   - configuring nginx as reverse proxy
   - client-side caching with Expires directive
   - compression with gzip and brotli
   - microcaching to cache dynamic content with proxy_cache_path directive
   - https
   - http2 (not implemented yet)
   - rate limiting with limit_req and limit_req_zone directives
   - caching with cache-control directive
