FROM node:18-slim

# Create a non-root user for security
RUN useradd -ms /bin/bash user
USER user
WORKDIR /home/user

# This is a placeholder, as we will mount the code to be executed
COPY . .

# The command to run the code will be passed in by dockerode
CMD ["node", "temp.js"]
