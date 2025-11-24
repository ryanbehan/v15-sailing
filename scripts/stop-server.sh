#!/bin/bash

# Stop any running serve processes for this project
echo "Stopping Next.js server..."

# Find and kill serve process serving the out directory
pkill -f "serve.*out"

# Check if the process was stopped
if [ $? -eq 0 ]; then
  echo "Successfully stopped the server"
else
  echo "No running server found or error stopping the server"
  exit 1
fi
