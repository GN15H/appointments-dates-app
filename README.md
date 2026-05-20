![CI/CD](https://github.com/GN15H/appointments-dates-app/actions/workflows/deploy.yml/badge.svg)
## CI/CD Pipeline

Every push to `main` automatically triggers the deployment pipeline via GitHub Actions.

### Pipeline steps

```
Push to main
    │
    ▼
Install dependencies (npm ci)
    │
    ▼
Build (nest build)
    │
    ▼
Run unit tests
    │
    ▼
Deploy to AWS Lambda (Serverless Framework v3)
```

### What it does

- **Dependencies** — installs exact versions from `package-lock.json` for reproducible builds
- **Build** — compiles TypeScript to JavaScript via NestJS compiler
- **Tests** — runs unit tests and blocks deploy if any fail
- **Deploy** — provisions and updates AWS infrastructure automatically through CloudFormation

### Branch strategy

- `main` — production branch, protected. Every push triggers a full deploy
- `dev` — development branch, work happens here before merging to main

> Deploy only happens if all previous steps pass — a failing test prevents a broken build from reaching production.

# BookFlow API

A GraphQL and REST API for managing service bookings. Built to demonstrate production-ready serverless architecture on AWS.

> A business (barbershop, sports school, clinic, etc.) can list their services, and clients can book, view, and cancel appointments through a fully authenticated API.

---

## Tech Stack

- **NestJS** Node.js framework with modular architecture
- **GraphQL** API query language with code-first schema generation
- **AWS Lambda** Serverless compute via Serverless Framework
- **AWS API Gateway** HTTP entry point routing requests to Lambda
- **AWS DynamoDB** NoSQL database using single-table design
- **AWS Cognito** User authentication and JWT token management
- **TypeScript** Full type safety across the codebase

---

## Architecture

```
Client
  │
  ▼
API Gateway  (HTTP entry point)
  │
  ▼
Lambda  (NestJS app via serverless-express)
  ├── CognitoGuard  (validates JWT on every request)
  ├── UsersResolver
  ├── ServicesResolver
  └── BookingsResolver
        ├── DynamoDB  (single-table design)
        └── Cognito   (user attribute lookup)
```

### DynamoDB Single-Table Design

All entities live in one table with composite keys:

| pk | sk | Entity |
|---|---|---|
| `USER#<id>` | `PROFILE` | User profile |
| `SERVICE#<id>` | `META` | Offered service |
| `USER#<id>` | `BOOKING#<date>#<time>#<id>` | Booking (user view) |
| `SERVICE#<id>` | `BOOKING#<date>#<time>` | Booking (slot lock) |

Each booking writes two rows. One under the user for history queries, one under the service to prevent double-booking, and service-based querying without table scans.

---

## API Reference

All queries and mutations require a `Bearer` token from AWS Cognito in the `Authorization` header. The GraphQL endpoint is at /graphql proxy.

### Queries

**Get current user profile**
```graphql
query {
  me {
    id
    email
    name
    role
    createdAt
  }
}
```

```REST
GET /users
```

**List all services**
```graphql
query {
  services {
    id
    name
    description
    price
    durationMinutes
  }
}
```

```REST
GET /services
```

**Get my bookings**
```graphql
query {
  myBookings {
    id
    serviceId
    date
    timeSlot
    status
    createdAt
  }
}
```

```REST
GET /bookings
```


### Mutations

**Create a service**
```graphql
mutation {
  createService(input: {
    name: "Haircut"
    description: "Classic 30-minute haircut"
    price: 25000
    durationMinutes: 30
  }) {
    id
    name
  }
}
```

```REST
POST /services
```
```json
{   
    "name": "Haircut",
    "description": "Classic 30-minute haircut",
    "price": 25000,
    "durationMinutes": 30
}
```
**Book an appointment**
```graphql
mutation {
  createBooking(input: {
    serviceId: "your-service-id"
    date: "2024-11-15"
    timeSlot: "10:00"
  }) {
    id
    status
    date
    timeSlot
  }
}
```

```REST
POST /bookings
```
```json
{
    "serviceId": "your-service-id",
    "date": "2024-11-15",
    "timeSlot": "10:00"
}
```


**Cancel a booking**
```graphql
mutation {
  cancelBooking(
    bookingId: "your-booking-id"
    date: "2024-11-15"
    timeSlot: "10:00"
  ) {
    id
    status
  }
}
```

```REST
PATCH /bookings
```
```json
{
    "bookingId": "your-booking-id",
    "date": "2024-11-15",
    "timeSlot": "10:00"
}
```

---

## Running Locally

### Prerequisites

- Node.js 20+
- AWS CLI configured with a valid profile
- An AWS Cognito User Pool

### Setup

```bash
git clone https://github.com/GN15H/appointments-dates-app
cd appointments-dates-app
npm install
```

Create a `.env` file in the root:

```env
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
COGNITO_REGION=us-east-1
DYNAMO_TABLE_NAME=bookflow
AWS_REGION=us-east-1
AWS_PROFILE=XXXXXXXXXXX
```

Start the server:

```bash
npm run start:dev
```

GraphQL playground available at `http://localhost:3000/graphql`

### Getting a token

```bash
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=your@email.com,PASSWORD=yourpassword \
  --client-id YOUR_CLIENT_ID \
  --query 'AuthenticationResult.IdToken' \
  --output text
```

Use the token in the playground headers:

```json
{ "Authorization": "Bearer <your-token>" }
```

---

## Deployment

```bash
npm run deploy
```

Deploys to AWS via Serverless Framework — creates Lambda, API Gateway, IAM roles, and CloudWatch log groups automatically through CloudFormation.

---

## Key Design Decisions

**Why single-table DynamoDB?** DynamoDB doesn't support joins. Single-table design co-locates related data so any access pattern resolves in a single query with no additional round trips.

**Why two rows per booking?** One row under `USER#id` enables "get all bookings for a user" queries. A second row under `SERVICE#id` acts as a slot lock, checking availability before creating a booking is an O(1) lookup regardless of how many total bookings exist.

**Why IdToken instead of AccessToken?** The IdToken carries user attributes (email, name) issued by Cognito at login. The AccessToken only carries session claims. Since the API needs user attributes to create profiles on first login, IdToken is the right choice here.

**Why NestJS inside Lambda?** NestJS is designed for long-lived servers but adapts cleanly to Lambda via `serverless-express`. The modular architecture (guards, resolvers, services) keeps the codebase organized as it grows, which wouldn't be the case with a bare Lambda function.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=flat&logo=awslambda&logoColor=white)
![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=flat&logo=amazondynamodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
