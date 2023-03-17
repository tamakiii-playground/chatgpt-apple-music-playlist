FROM node:18.15.0

WORKDIR /app

# Install necessary dependencies for Playwright
RUN apt-get update && \
    apt-get install -y \
      libnss3 \
      libnspr4 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libdrm2 \
      libdbus-1-3 \
      libatspi2.0-0 \
      libxcomposite1 \
      libxdamage1 \
      libxfixes3 \
      libxrandr2 \
      libgbm1 \
      libxkbcommon0 \
      libasound2 \
      && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json /app
RUN npm install
COPY . /app

CMD ["node", "main.js"]
