# INF653 Final Project: U.S. States API

A RESTful API built with Node.js, Express, and MongoDB Atlas that provides information about U.S. states, including dynamic “fun facts” stored in MongoDB.

## Features

- List all 50 U.S. states (with optional filtering of contiguous vs. non-contiguous)  
- Retrieve details for a single state (name, code, slug, URLs, etc.)  
- Fetch formatted population figures (with commas)  
- Store, retrieve, update, and delete “fun facts” for each state in MongoDB  
- Endpoints for state capital, nickname, and admission date  

## Prerequisites

- Node.js v16 or higher  
- npm (bundled with Node.js)  
- A MongoDB Atlas cluster (or a local MongoDB instance)  

## Installation

1. **Clone this repository**  
   ```bash
   git clone https://github.com/emvaldez1/INF653_Final_Project.git
   cd INF653_Final_Project
