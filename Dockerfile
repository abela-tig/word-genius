# Step 1: Use a lightweight Node.js image based on Alpine Linux
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /word-genius

# Step 3: Install dependencies
# First, copy package.json and package-lock.json (or yarn.lock if you're using Yarn)
COPY . .

Run ls 

RUN npm install 

# Step 5: Copy the rest of the application code into the container

# Step 6: Expose the port that your application will run on
EXPOSE 3000

# Step 7: Define the command to run your Node.js app
CMD ["npm", "start"]
