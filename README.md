# Interactive Data Analytics Web App with Tabulator and PostgreSQL

This project demonstrates building interactive data analytics web apps with [Tabulator](https://github.com/olifolkerd/tabulator), a powerful JavaScript library for creating tabular interfaces. It showcases connecting Tabulator to a [PostgreSQL](https://github.com/postgres/postgres) database for displaying large datasets with features like pagination, sorting, and filtering handled efficiently by the database.

## Getting Started
### Prerequisites:
* Node.js (version 20 or later recommended) - https://nodejs.org/
* Docker - https://www.docker.com/

### Running the Demo:

**1. Database**

```bash
cd database
bash build.sh # build the docker image
bash run.sh   # run the docker container
```

**2. Backend**

```bash
cd backend
npm install # install the dependencies
npm run dev # start development server
```

**3. Frontend**

```bash
cd frontend
npm install # install the dependencies
npm run dev # start the development server
```

## Data
The demo uses dummy data generated with [Faker.js](https://github.com/faker-js/faker) to represent a webshop's [conversion funnel](https://en.wikipedia.org/wiki/Purchase_funnel).

## Security
This is a demonstration project, and security best practices are not fully implemented. However, to mitigate potential SQL injection vulnerabilities, basic Ajax parameter validation with regular expressions is included.
