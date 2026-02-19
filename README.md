# Address Book Application

## Overview

The Address Book Application is a comprehensive web-based contact management system designed for beginners to understand fundamental web development concepts. This application demonstrates CRUD (Create, Read, Update, Delete) operations, RESTful API integration, form validation, and responsive design principles using vanilla HTML, CSS, and JavaScript.

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Usage Guide](#usage-guide)
7. [Technical Architecture](#technical-architecture)
8. [API Endpoints](#api-endpoints)

## Features

### Core Functionality
- **Add Contacts**: Create new contact entries with complete information
- **Edit Contacts**: Modify existing contact details
- **Delete Contacts**: Remove contacts with confirmation dialog
- **Search Capability**: Real-time search across multiple fields (name, email, phone)
- **Sort Functionality**: Organize contacts by first name, last name, or email
- **Duplicate Prevention**: Automatic detection and prevention of duplicate email addresses
- **Form Validation**: Client-side validation for all required fields
- **Responsive Design**: Mobile-friendly interface that adapts to different screen sizes

### User Interface Features
- Clean and modern card-based layout
- Modal dialogs for add/edit operations
- Toast notifications for user feedback
- Statistics dashboard showing total and filtered contact counts
- Loading and error states
- Smooth animations and transitions

## Project Structure

```
AddressbookApp/
│
├── index.html              # Main HTML file - Application entry point
│
├── css/
│   └── style.css          # Stylesheet - All visual styling and responsive design
│
├── js/
│   └── script.js          # JavaScript - Application logic and functionality
│
├── data/
│   └── db.json            # JSON Server database - Contact data storage
│
├── package.json           # NPM configuration - Dependencies and scripts
├── package-lock.json      # NPM lock file - Dependency version control
│
└── README.md             # Documentation - This file
```

## Prerequisites

Before running this application, ensure you have the following installed:

1. **Node.js** (version 12.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **NPM** (Node Package Manager - comes with Node.js)
   - Verify installation: `npm --version`

3. **Modern Web Browser**
   - Chrome, Firefox, Safari, or Edge (latest versions)

## Installation

Follow these steps to set up the application:

1. **Navigate to the project directory**:
   ```bash
   cd AddressbookApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   This will install:
   - json-server: A full fake REST API for development

## Running the Application

### Step 1: Start the JSON Server

Open a terminal in the project directory and run:

```bash
npm start
```

This command will:
- Start a local server on `http://localhost:3000`
- Watch the `data/db.json` file for changes
- Provide RESTful API endpoints for contact operations

You should see output similar to:
```
Resources
http://localhost:3000/persons

Home
http://localhost:3000
```

### Step 2: Open the Application

1. **Option 1**: Open `index.html` directly in your web browser
   - Right-click on `index.html` and select "Open with Browser"
   - Or double-click the file

2. **Option 2**: Use a local development server (recommended)
   - Install Live Server extension in VS Code
   - Right-click `index.html` and select "Open with Live Server"

### Important Note
Keep the terminal running while using the application. The JSON Server must be active to perform CRUD operations.

## Usage Guide

### Adding a New Contact

1. Click the **"+ Add Contact"** button in the header
2. Fill in the required fields:
   - First Name (minimum 2 characters)
   - Last Name (minimum 2 characters)
   - Email (valid email format)
   - Phone (minimum 10 digits)
3. Optionally fill in:
   - Address
   - City
4. Click **"Save"** to add the contact
5. The system will validate input and check for duplicate emails

### Editing an Existing Contact

1. Locate the contact card you want to edit
2. Click the **"Edit"** button on the contact card
3. Modify the fields in the modal dialog
4. Click **"Save"** to update the contact
5. Changes will be reflected immediately

### Deleting a Contact

1. Locate the contact card you want to delete
2. Click the **"Delete"** button on the contact card
3. Confirm the deletion in the confirmation dialog
4. Click **"Delete"** to permanently remove the contact

### Searching Contacts

1. Use the search box at the top of the page
2. Type any part of:
   - First Name
   - Last Name
   - Email
   - Phone Number
3. Results update in real-time as you type
4. The display count updates to show filtered results

### Sorting Contacts

1. Use the **"Sort By"** dropdown menu
2. Select a field to sort by:
   - First Name
   - Last Name
   - Email
3. Contacts will be sorted alphabetically
4. Click **"Reset"** to clear sorting

### Resetting Filters

1. Click the **"Reset"** button
2. This will:
   - Clear the search box
   - Reset the sort dropdown
   - Display all contacts

## Technical Architecture

### Frontend Technologies

**HTML5**
- Semantic markup structure
- Form elements with validation attributes
- Modal dialogs
- Accessible design principles

**CSS3**
- Flexbox and Grid layouts
- CSS variables for theming
- Responsive design with media queries
- Smooth transitions and animations
- Mobile-first approach

**JavaScript (ES6+)**
- Vanilla JavaScript (no frameworks)
- Fetch API for AJAX requests
- Promise-based asynchronous operations
- Event-driven programming
- DOM manipulation

### Backend (JSON Server)

JSON Server provides a complete REST API:
- GET requests to retrieve data
- POST requests to create new records
- PUT requests to update existing records
- DELETE requests to remove records

## API Endpoints

The JSON Server provides the following endpoints:

| Method | Endpoint                    | Description              |
|--------|----------------------------|--------------------------|
| GET    | /persons                   | Get all contacts         |
| GET    | /persons/:id               | Get a specific contact   |
| POST   | /persons                   | Create a new contact     |
| PUT    | /persons/:id               | Update a contact         |
| DELETE | /persons/:id               | Delete a contact         |

### Example API Usage

**Get all contacts:**
```javascript
fetch('http://localhost:3000/persons')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Add a new contact:**
```javascript
fetch('http://localhost:3000/persons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'New York'
  })
});
```
