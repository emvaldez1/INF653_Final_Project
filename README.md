# INF653 Final Project: U.S. States API

A RESTful API built with Node.js, Express, and MongoDB Atlas that provides information about U.S. states, including dynamic “fun facts” stored in MongoDB.

---

## Table of Contents

- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Seeding the Database](#seeding-the-database)  
- [Running the App](#running-the-app)  
- [API Endpoints](#api-endpoints)  
  - [Root](#root)  
  - [All States](#all-states)  
  - [Single State](#single-state)  
  - [Population](#population)  
  - [Fun Facts](#fun-facts)  
  - [Capital, Nickname & Admission](#capital-nickname--admission)  
- [Error Handling](#error-handling)  
- [Author](#author)  
- [License](#license)  

---

## Features

- ☑️ List all 50 states (with optional filtering of contiguous vs. non-contiguous)  
- ☑️ Fetch details for a single state (name, code, slug, URLs, etc.)  
- ☑️ Retrieve formatted population figures with commas  
- ☑️ Store, retrieve, update and delete “fun facts” per state in MongoDB  
- ☑️ Endpoints for state capital, nickname, and admission date  

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher  
- [npm](https://www.npmjs.com/) (bundled with Node)  
- A MongoDB Atlas cluster (or local MongoDB)  

---

## Installation

```bash
# 1. Clone this repository
git clone https://github.com/emvaldez1/INF653_Final_Project.git
cd INF653_Final_Project

# 2. Install dependencies
npm install
