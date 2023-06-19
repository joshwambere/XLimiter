# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the app source code

COPY . .

# copy env file
COPY .env .

# Expose the app port
EXPOSE 1000

# Start the app
CMD [ "yarn", "start" ]
