NOTE: This is in not actively maintained, most of the code was written in 2020 and only somewhat updated in 2022.Typescript support is there, but nothing is really typed yet.

TO-DO:

- Typing
- GraphQL instead of REST
- Add an ObjectionJS model for the pricing runs and insert them into DB

# tuner

A web service to automatically fetch information on a vinyl record and scrape several e-commerce vendors for its price.

![a gif demonstration of the service](service_demo_video.gif)

## Purpose

To build a good-looking service that potentially leads to saving some \$\$\$ on vinyl record purchases. Built for fun and to test out how fast I can dish out a full service.

## Implementation

- Front-end: React for the component & event-handling + Axios for the network requests.
- Back-end: ExpressJS for route management + Puppeteer for the scraping.
- Infrastructure: Docker

## Integrations

- Discogs API - to fetch vinyl record data such as name, release data and a link to a cover.

## Project structure

- `/price-fetching-service` contains the back-end
- `/web-app` contains the front-end
- `/docker-setup` contains the docker configuration and a script to set up the database

## Running

1. `cd docker-setup && docker-compose up database`
2. `cd scripts && chmod +x setup_database.sh && ./setup_database.sh && cd ..`
3. `docker-compose up price-fetching-service web-app`
