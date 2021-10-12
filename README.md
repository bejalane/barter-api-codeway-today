<p align="center">
  <a href="http://learning.codeway.today" target="blank"><img src="https://codeway.today/wp-content/uploads/2021/10/logo-black.png" width="320" alt="Codeway.today Logo" /></a>
</p>

## Description

Api project for learning front-end framworrks.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

```

## APIs

```bash
# User
POST: http://localhost:4000/login
POST: http://localhost:4000/register

# Barters
GET: http://localhost:4000/api/barter
POST: http://localhost:4000/api/barter
PUT: http://localhost:4000/api/barter/:barterId
DELETE: http://localhost:4000/api/barter/:barterId

# Comments
POST: http://localhost:4000/api/comment/barter/:barterId
DELETE: http://localhost:4000/api/comment/:commentId

```

The file Barter.postman_collection inside the repo is the collection of APIs for Postman.
