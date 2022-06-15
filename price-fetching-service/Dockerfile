#https://blog.logrocket.com/how-to-set-up-a-headless-chrome-node-js-server-in-docker/
FROM node:14-alpine as base

RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      "freetype>2.8" \
      g++ \
      # Install graphicsmagick for gm npm package
      graphicsmagick \
      harfbuzz \
      make \
      nmap \
      nss \
      python3 \
      tini \
      ttf-freefont

ENV CHROMIUM_BIN: /usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: true