#syntax=docker/dockerfile:1

# This Dockerfile uses the service folder as context.


# --
# Global build arguments

ARG UID=1001


# --
# Upstream images

FROM node:22-slim AS node_upstream
FROM bitnami/nginx:1.27 AS nginx_upstream


# --
# Base image

FROM node_upstream AS app_base

# Set app directory
WORKDIR /app


# --
# Build base image

FROM app_base AS app_build_base

# Install pnpm
RUN --mount=type=cache,target=~/.npm \
	npm install -g pnpm


# --
# Build dev image

FROM app_build_base AS app_build_dev

# Copy app build configuration
COPY --link \
	./app/package.json \
	./app/pnpm-lock.yaml \
	./

# Install app development dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --frozen-lockfile


# --
# Build prod image

FROM app_build_base AS app_build_prod

# Copy app build configuration
COPY --link \
	./app/package.json \
	./app/pnpm-lock.yaml \
	./

# Install app production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --prod --frozen-lockfile


# --
# CLI image

FROM app_build_base AS app_cli

ARG UID

# Use temporary directory as home
ENV HOME=/tmp

# Run as non-root user
USER ${UID}:0

# Mount source code
VOLUME /app

# Run CLI command
COPY --link --chmod=755 ./docker/cli-entrypoint.sh /usr/local/bin/app-cli-entrypoint
ENTRYPOINT [ "app-cli-entrypoint" ]
CMD [ "--help" ]


# --
# Dev image

FROM app_base AS app_dev

ARG UID

# Set runtime environment
ENV APP_ENV=dev
ENV NODE_ENV=development

# Copy app development dependencies
COPY --link --from=app_build_dev --chown="${UID}:0" /app/node_modules ./node_modules

# Copy source code
COPY --link --chown="${UID}:0" ./app .
RUN mkdir -p ./.astro && chown -R "${UID}:0" ./.astro

# Create user 'user' in group 'root'
RUN USERNAME="$(getent passwd "${UID}" | cut -d: -f1)"; \
	if [ -z "${USERNAME}" ]; then \
		useradd -lm -u "${UID}" -g "${UID}" -G 0 user; \
	else \
		usermod -a -G 0 "${USERNAME}"; \
	fi

# Run as non-root user
USER ${UID}:0

# Set exposed port
ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start development server
CMD [ "sh", "-c", "npm run dev -- --host --port \"${PORT}\"" ]


# --
# Prod build image

FROM app_base AS app_prod_build

ARG UID

# Set runtime environment
ENV APP_ENV=prod
ENV NODE_ENV=production

# Copy app production dependencies
COPY --link --from=app_build_prod --chown="${UID}:0" /app/node_modules ./node_modules

# Copy source code
COPY --link --chown="${UID}:0" ./app .

# Use application environment variables
ARG GITHUB_REPOSITORY_URL=""
ENV GITHUB_REPOSITORY_URL=${GITHUB_REPOSITORY_URL}
ARG GITHUB_SHA=""
ENV GITHUB_SHA=${GITHUB_SHA}

# Build application
ARG BUILD_CHECK=true
RUN if [ "${BUILD_CHECK}" = "true" ]; then \
		npm run build; \
	else \
		npm run build-only; \
	fi


# --
# Prod image

FROM nginx_upstream AS app_prod

# Set runtime environment
ENV APP_ENV=prod

# Copy app production build
COPY --from=app_prod_build --link /app/dist .

# Set exposed port
ARG PORT=8080
ENV NGINX_HTTP_PORT_NUMBER=${PORT}
EXPOSE ${PORT}
