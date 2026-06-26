# Base node image
FROM node:20-bookworm-slim AS base

# Install openssl for Prisma and other dependencies
RUN apt-get update && apt-get install -y openssl sqlite3 ca-certificates

# Install all node_modules, including dev dependencies
FROM base AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci --legacy-peer-deps

# Setup production node_modules
FROM base AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app/
RUN npm ci --omit=dev --legacy-peer-deps

# Build the app
FROM base AS build-env
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app/

# Generate Prisma client
ADD prisma /app/prisma
RUN npx prisma generate

# Build React Router app
RUN npm run build

# Final production image
FROM base

ENV FLY="true"
ENV DATA_DIR="/data"
ENV DATABASE_FILENAME="sqlite.db"
ENV DATABASE_PATH="$DATA_DIR/$DATABASE_FILENAME"
ENV DATABASE_URL="file:$DATABASE_PATH"
ENV CACHE_DATABASE_FILENAME="cache.db"
ENV CACHE_DATABASE_PATH="$DATA_DIR/$CACHE_DATABASE_FILENAME"
ENV PORT="8080"
ENV NODE_ENV="production"

# Make SQLite CLI accessible
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$CACHE_DATABASE_PATH" > /usr/local/bin/cache-database-cli && chmod +x /usr/local/bin/cache-database-cli

WORKDIR /app/

# Copy production dependencies and Prisma client
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/node_modules/.prisma /app/node_modules/.prisma

# Copy built application
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/public /app/public

# Copy package files and server
COPY ./package.json package-lock.json server.js /app/
COPY --from=build-env /app/prisma /app/prisma
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

# The Fly volume is mounted here at runtime; SQLite lives directly on it.
RUN mkdir -p /data

CMD ["./start.sh"]
