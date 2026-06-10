# Task Flow

Task Flow is a "full-stack" task and project management application built during my DevOps internship. The goal of the project was not just to create a CRUD application, but to understand how a production-style application is developed, containerized, deployed, monitored, and maintained.

The application allows users to create accounts, manage projects, and organize tasks through a secure REST API. Authentication is handled using JWT tokens and OAuth2, passwords are securely hashed using bcrypt, and PostgreSQL is used as the primary database. Redis is integrated for caching, while Nginx acts as a reverse proxy for routing requests between services.

As I kept adding features, I also started focusing on how the application would run outside of my local machine. I containerized the services with Docker and Docker Compose, set up a GitHub Actions pipeline to automate testing, and deployed everything to Railway. I also added rate limiting to authentication endpoints for better security and integrated Prometheus and Grafana so I could monitor application activity and performance in real time.

## tech.

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, Redis

**Frontend:** React, Vite (ft. antigravity)

**DevOps & Infrastructure:** Docker, Docker Compose, Nginx, GitHub Actions, Railway

**Monitoring:** Prometheus, Grafana

## stuff.

* JWT-based authentication and authorization system
* Project and task management APIs
* PostgreSQL database integration using SQLAlchemy ORM
* Redis caching layer
* Dockerized multi-service architecture
* Nginx reverse proxy configuration
* Automated testing with Pytest
* CI pipeline using GitHub Actions
* Continuous deployment through Railway
* Prometheus metrics collection and Grafana dashboards
* Authentication rate limiting for improved security
  
## Monitoring

The application exposes custom metrics through a `/metrics` endpoint, allowing Prometheus to collect operational data such as login activity, project creation, and task-related operations. These metrics are visualized through Grafana dashboards to provide real-time insights into application behavior and usage patterns.

## Running Locally
have docker installed
clone the repo 
```bash
docker compose up --build
```
and boom.
This starts the complete development environment including the frontend, backend, PostgreSQL database, Redis cache, Prometheus, and Grafana.
