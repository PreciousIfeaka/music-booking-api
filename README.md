# Music Booking API

## Overview

The **Music Booking API** is a robust backend service built using **NestJS**, allowing users to register, book music services or artists, and make payments seamlessly. This API provides structured authentication, booking, events creation, artists profile management and payment processing functionalities.

## Features

- User registration and authentication (JWT-based)
- Artist and event management
- Booking system for music-related services
- Payment processing with Stripe
- API documentation via Swagger
- Secure database integration with PostgreSQL

## Technologies Used

- **NestJS** (TypeScript-based framework for scalable applications)
- **TypeORM** (Database ORM)
- **PostgreSQL** (Relational Database Management System)
- **JWT** (JSON Web Tokens for authentication)
- **Stripe** (For payment processing)
- **Swagger** (API documentation)
## Project File Structure

|--- src
|    |--- database
|    |--- filters
|    |--- guards
|    |--- interceptors
|    |--- modules
|    |--- decorators
|    |--- app.controller.ts
|    |--- app.module.ts
|    |--- app.service.ts
|    |--- main.ts
|--- test
|--- .env.example
|--- .eslintrc.js
|--- .prettierrc
|--- nest-cli.json
|--- .gitignore
|--- package.json
|--- tsconfig.json
|--- tcsonfig.build.json


## Prerequisites

Ensure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- PostgreSQL (Locally or via a cloud provider)

## Getting Started

### 1. Clone the Repository

```bash
  git clone https://github.com/PreciousIfeaka/music-booking-api.git
  cd music-booking-api
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
#or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and define the necessary environment variables as seen in the `.env.example` file

### 4. Run Database Migrations

Before running the API, apply database migrations:

```bash
chmod u+x check-and-migrate.sh && ./check-and-migrate.sh
```

### 5. Start the Application

```bash
npm run start:dev  # Runs in development mode
# or
npm run start:prod # Runs in production mode
```

### 6. Access API Documentation

Once the server is running, navigate to:

```
http://localhost:3000/api/docs
```

This provides an interactive Swagger UI to test the APIs.

---

## API Endpoints

### Authentication

#### Register a User

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "account_type": "Artist"
}
```

#### Login

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Artists

#### Get All Artists

**GET** `/api/artists`

#### Get Artist by ID

**GET** `/api/artists/:id`

#### Create an Artist (Admin Only)

**POST** `/api/artists`

### Bookings

#### Create a Booking

**POST** `/api/bookings`

```json
{
  "artistId": "123",
  "eventId": "456",
  "date": "2025-06-10T12:00:00Z"
}
```

#### Get User Bookings

**GET** `/api/bookings`

### Payments

#### Make a Payment

**POST** `/api/payments`

```json
{
  "booking_id": "789",
  "amount": 100.0
}
```

You can check the Swagger docs or Postman collections to get the comprehensive list of API endpoints for testing.

---

---

## Author

Developed by **Precious Ifeaka**.

