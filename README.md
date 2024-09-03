# Waste Management App Backend

This is the backend for the Waste Management app, designed to teach young people about waste sorting.

## Setup

1. Install Docker and Docker Compose on your system.
2. Clone this repository.
3. Navigate to the project directory.
4. Run `docker-compose build` and then `docker-compose up` to start the application. populate.py can be used to populate MongoDB with mock data.

The API will be available at `http://localhost:80`.

## API Endpoints

### Users

- POST /api/users/register - Register a new user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile (requires authentication)
- POST /api/users/update-score - Update user score (requires authentication)

### Waste Categories

- GET /api/waste-categories - Get all waste categories
- GET /api/waste-categories/:id - Get a specific waste category
- POST /api/waste-categories - Create a new waste category (requires authentication)
- PUT /api/waste-categories/:id - Update a waste category (requires authentication)
- DELETE /api/waste-categories/:id - Delete a waste category (requires authentication)

### Waste Items

- GET /api/waste-items - Get all waste items
- GET /api/waste-items/:id - Get a specific waste item
- POST /api/waste-items - Create a new waste item (requires authentication)
- PUT /api/waste-items/:id - Update a waste item (requires authentication)
- DELETE /api/waste-items/:id - Delete a waste item (requires authentication)

### Challenges

- GET /api/challenges - Get all challenges
- GET /api/challenges/:id - Get a specific challenge
- POST /api/challenges - Create a new challenge (requires authentication)
- PUT /api/challenges/:id - Update a challenge (requires authentication)
- DELETE /api/challenges/:id - Delete a challenge (requires authentication)

## Development

To add new features or modify existing ones, update the relevant files in the `src` directory. Remember to rebuild and restart the Docker containers after making changes.

## Testing

To test the application, `npm test` command can be used.

## Deployment

For production deployment, make sure to set appropriate environment variables, especially for the MongoDB connection string and JWT secret.
