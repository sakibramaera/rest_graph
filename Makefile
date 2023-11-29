# Makefile for building and running a Nodejs program

# author:ahmed@chistey

# Variables
SRC_DIR := src
BINARY_NAME := dist

.PHONY: dev
dev: 
	@echo "Running..."
	@bun run dev

.PHONY: prisma-migrate
prisma-migrate: prisma-migrate
	@echo "Running..."
	@bunx prisma migrate dev

.PHONY: prisma-generate
prisma-generate: prisma-generate
	@echo "Running..."
	@bunx prisma generate

.PHONY: clean 
clean:
	@echo "Cleaning..."
	@rm -rf $(BINARY_NAME)

.PHONY: run-require-containers
run-require-containers: postgres-docker redis-docker

.PHONY: postgres-docker
postgres-docker: 
	@echo "Running..."
	@docker-compose -f docker-compose/services/docker-compose-postgres.yml up -d

.PHONY: redis-docker
redis-docker:
	@echo "Running..."
	@docker-compose -f docker-compose/services/docker-compose-redis.yml up -d

.PHONY: remove-all-containers
remove-docker-all-containers:
	@echo "Running..."
	@docker rm -fv $$(docker ps -aq)

.PHONY: remove-docker-all-images
remove-docker-all-images:
	@echo "Running..."
	@docker rmi $$(docker images -aq) -f

# Default target
.DEFAULT_GOAL := run