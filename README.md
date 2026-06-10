# Task Flow

Task Flow is a full-stack task and project management application built during a DevOps internship. The project follows a production-style architecture with a FastAPI backend, PostgreSQL database, Redis caching, Docker containerization, CI/CD automation, monitoring, and cloud deployment.

## Features

* User authentication using JWT and OAuth2
* Secure password hashing with bcrypt
* Project creation and management
* Task creation, update, retrieval, and deletion
* Role-based authorization
* Redis caching for improved performance
* Authentication rate limiting
* Prometheus metrics collection
* Grafana monitoring dashboards
* Automated testing with Pytest
* Continuous Integration using GitHub Actions
* Continuous Deployment using Railway

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Redis

### Frontend

* React
* Vite

### DevOps & Infrastructure

* Docker
* Docker Compose
* Nginx
* GitHub Actions
* Railway

### Monitoring

* Prometheus
* Grafana

## Architecture

Frontend (React)
↓
Nginx Reverse Proxy
↓
FastAPI Backend
↓
PostgreSQL

Redis Cache

Prometheus Monitoring
↓
Grafana Dashboard

## API Modules

### Authentication

* POST /signup
* POST /login

### Projects

* GET /projects
* GET /projects/{id}
* POST /projects
* DELETE /projects/{id}

### Tasks

* GET /tasks
* GET /tasks/{id}
* POST /tasks
* PUT /tasks/{id}
* DELETE /tasks/{id}
* GET /projects/{id}/tasks

## CI/CD Pipeline

The project uses GitHub Actions for Continuous Integration.

Pipeline stages:

1. Repository checkout
2. Python environment setup
3. Dependency installation
4. Backend validation
5. PostgreSQL and Redis service provisioning
6. Automated testing with Pytest
7. Docker image build verification

Successful commits are automatically deployed to Railway.

## Monitoring

Custom Prometheus metrics are used to monitor:

* Login attempts
* Successful logins
* Failed logins
* Projects created
* Tasks created
* Tasks completed

Metrics are exposed through the `/metrics` endpoint and visualized using Grafana dashboards.

## Running Locally

```bash
docker compose up --build
```

Services:

* Frontend
* Backend
* PostgreSQL
* Redis
* Prometheus
* Grafana

## Future Improvements

* Role-based access control expansion
* Distributed caching strategies
* Alerting with Grafana
* Kubernetes deployment
* Multi-user project collaboration
* Advanced analytics dashboard
