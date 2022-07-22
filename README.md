![a gif demonstration of the service](service_demo_video.gif)

# About 💬

Automatically fetch information and prices for a vinyl record.

## Integrations 🔌

- Official API for `Discogs` - to fetch album information such as name, release data and a link to a cover image.
- Screenscraping for `Amazon`, `Ebay`, `Value Your Music` and `The Records corner` to get a price range for the queried album.

## Structure 🏗

- `/price-fetching-service` contains the back-end (ExpressJS) and screen-scraping (Puppeteer) functionality.
- `/web-app` contains the front-end (React) from which queries about album pricing are sent.
- `/infrastructure` contains the Docker configuration and a script to set up the database (Postgres).

## Running 🔼

A prerequisite for running this is having registered an app with Discogs, so that you have a client secret and client key to use.

1. Put your Discogs client secret and client key tokens in the `docker-compose.yml` file in the `tuner-price-fetching-service` environment variables section.
2. `cd infrastructure && docker-compose up`

## TO-DO 👷‍♂️:

- Add typing to `web-app`
