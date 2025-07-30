NAME = transcendence

all: build up

# Start services
up:
	docker compose up -d --force-recreate --remove-orphans

# Build services
build:
	docker compose build

# Stop services
down:
	docker compose down

# View logs
logs:
	docker compose logs -f

# Show running containers
ps:
	docker compose ps

# Remove stopped containers
clean:
	docker compose down --remove-orphans
	docker system prune -f
	
# Remove everything including volumes
fclean: down
	docker compose down -v
	docker system prune -af
	docker volume prune -f
	rm -rf ./backend/database.sqlite

# Rebuild everything from scratch
re: fclean all
.PHONY: all clean fclean re up down build logs ps
