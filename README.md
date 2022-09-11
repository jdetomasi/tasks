## Installation

```bash
$ npm install
```

## Running the app and db with docker

```bash
$ docker-compose up -d
```

## Running the app

Note: will need to configure .env variables properly. See: .env.sample

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```

## Try the API

### Login

Test credentials for the API (user registration is not implemented yet):

```
username: julian
password: changeme
```

#### Login using the test credentials

```
curl --location --request POST 'localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "julian",
    "password": "changeme"
}'
```

This will return an access token that would be needed for all the secured endpoints:

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbiIsInVzZXJJZCI6IjYyZTk4MDRiZmU5MGJkMGU3MTU1ZGE0NSIsImlhdCI6MTY2MjkwNDc0N30.eEr4DnPprX9a2o1KS6blMCWa_ZN4rNnjuFK99cJ1Cpw"
}
```

### Create new task

```
curl --location --request POST 'localhost:3000/tasks' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbiIsInVzZXJJZCI6IjYyZTk4MDRiZmU5MGJkMGU3MTU1ZGE0NSIsImlhdCI6MTY2MjkwNDc0N30.eEr4DnPprX9a2o1KS6blMCWa_ZN4rNnjuFK99cJ1Cpw' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "new task",
    "description": "test",
    "status": "todo"
}'
```

### Get user tasks

```
curl --location --request GET 'localhost:3000/tasks' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbiIsInVzZXJJZCI6IjYyZTk4MDRiZmU5MGJkMGU3MTU1ZGE0NSIsImlhdCI6MTY2MjkwNDc0N30.eEr4DnPprX9a2o1KS6blMCWa_ZN4rNnjuFK99cJ1Cpw'
```

### Update task status

```
curl --location --request PATCH 'localhost:3000/tasks/631e5d6abf99d19655bf51ea' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbiIsInVzZXJJZCI6IjYyZTk4MDRiZmU5MGJkMGU3MTU1ZGE0NSIsImlhdCI6MTY2MjkwNDc0N30.eEr4DnPprX9a2o1KS6blMCWa_ZN4rNnjuFK99cJ1Cpw' \
--header 'Content-Type: application/json' \
--data-raw '{
    "status": "done"
}'
```
