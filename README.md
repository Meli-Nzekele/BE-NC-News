# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Connecting to databases locally

In order to successfully connect to the two databases locally you will need to do the following:

You will need to create two .env files for your project:

- .env.test
- .env.development

Into each you will need to add PGDATABASE=<database_name_here>, with the correct database name for that environment:

- see /db/setup.sql for the database names

_Double check that the .env files are .gitignored (we do not want to push any sensitive information about our database and/or postgres passwords up to github.)_

## How to create environment variables using dotenv:

#### install dotenv:

`npm i dotenv`

- In the /db/connection.js file were we have set up our connection to the database, we can require dotenv into the file and invoke its config method.

- This will setup all of the environment variables from the .env file to the process.env.
