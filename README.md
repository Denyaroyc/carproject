# Grid Action Nexus

## Project Overview

Grid Action Nexus is a full-stack web application featuring a React frontend and a Node.js/Express backend with MongoDB for data storage. The app provides a powerful, filterable data grid for electric car data, supporting advanced search and filter operations.

---

## Project Structure

The project is organized into two main directories:

### Backend (`/backend`)

- **Controllers**: Handle API requests and business logic.
  - `dataController.ts`: Manages data operations such as fetching and processing data.
- **Models**: Define the MongoDB data schema.
  - `DataModel.ts`: Mongoose model for car data.
- **Routes**: Set up API endpoints.
  - `dataRoutes.ts`: Connects routes to controller methods.
- **Services**: Manage database interactions.
  - `dbService.ts`: Handles CRUD operations and database connection.
- **Server**: Entry point for the backend application.
  - `server.ts`: Configures the Express server, middleware, and API endpoints.

### Frontend (`/frontend`)

- **Components**: UI components for the application.
  - `DataGrid.tsx`: Displays data in a grid format with search and filter functionalities.
- **Services**: Handles API calls to the backend.
  - `backendService.ts`: Functions for fetching and manipulating data from the backend API.
- **Main Application**: Entry point for the React application.
  - `App.tsx`: Renders the data grid, filter UI, and manages routing.
  - `main.tsx`: Initializes the React application.

---

## Features

- **Data Grid**: View, search, and filter electric car data using AG Grid.
- **Advanced Filtering**: Filter by column with options: contains, equals, startsWith, endsWith, isEmpty, greaterThan, lessThan.
- **Action Buttons**: View and delete actions for each row, calling backend APIs.
- **Responsive UI**: Built with React and Material-UI.
- **REST API**: Express backend with endpoints for data retrieval and manipulation.
- **MongoDB Integration**: Stores and queries car data efficiently.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed.

---

### Setup Instructions

#### 1. **Clone the repository**
```sh
git clone <YOUR_GIT_URL>
cd grid-action-nexus
```

#### 2. **Set up the backend**
```sh
cd backend
npm install
npm run start
```
- The backend will start on [http://localhost:5000](http://localhost:5000) by default.

#### 3. **Set up the frontend**
```sh
cd ../frontend
npm install
npm run dev
```
- The frontend will start on [http://localhost:8080](http://localhost:8080) by default.

---

## API Endpoints

- `GET /api/cars`: Fetch all car data with optional search and filter query parameters.
- `GET /api/cars/:id`: Fetch a single car by ID.
- `DELETE /api/cars/:id`: Delete a car by ID.

See `backend/src/routes/dataRoutes.ts` and `backend/src/controllers/dataController.ts` for details.

---

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, TypeScript
- **Frontend**: React, AG Grid, TypeScript, Vite, Material-UI

---

## Deployment

To deploy the application:
- Ensure both backend and frontend are properly configured and running.
- You can use services like Heroku, Vercel, or any cloud provider for deployment.
- Set environment variables for MongoDB connection and API URLs as needed.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Credits

Developed by [Your Name/Team].  
Feel free to contribute or reach out for collaborations!