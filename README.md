Task Flow Personal Task Manager

A complete, responsive, and modern task management application designed to organize daily to-dos. Inspired by Notion's visual layout, the app includes three interactive views: List, Table, and Kanban Board. It features a collapsible sidebar, dynamic statistics, search and sorting filters, and a sliding Task Peek Drawer.

---

Project Overview

The Personal Task Manager is a full-stack web application designed for users who want a clean, aesthetic, and clutter-free interface to manage their tasks. It features:
- Client-Side SPA: A React application built with Vite and pure CSS for smooth transitions.
- Backend API: A Node.js and Express.js server providing RESTful endpoints.
- Local Database: An SQLite3 database storing persistent tasks securely.

---

Features

- Multi-Layout Database Views:
  -  List View: A clean, checkable list view for quick scanning.
  -  Table View: A structured, spreadsheet-like database table containing title, priority, due date, status, and actions.
  -  Board View: Columns grouped by priority levels (High, Medium, Low) to quickly triage tasks.
- Task Peek Drawer: A sliding panel from the right hand side that lets you view and update a task's full details (Title, Description, Due Date, and Priority) without leaving your page.
- Collapsible Sidebar: A sidebar showing progress stats (Total, Active, Completed counts) and filtering capabilities that can be collapsed for full-screen focus.
- Sorting & Searching: Search tasks by title in real-time and sort them by Newest First, Due Date (Soonest), or Priority (Highest).
- Data Persistence: Tasks are saved to a local SQLite database file (tasks.db) and are persisted across reboots.

---

Tech Stack

Frontend
- **React 19** - Component-based user interface.
- **Vite** - High-performance dev server and bundler.
- **Axios** - Promise-based HTTP client for API communication.
- **Vanilla CSS** - Premium custom design system with custom transitions and responsive layouts.

Backend
- **Node.js** - Server-side JavaScript runtime.
- **Express.js** - Lightweight web server framework.
- **SQLite3** - Relational SQL database stored in a single file (`tasks.db`).
- **Nodemon** (Dev-dependency) - Hot-reloads backend files when changes occur.

---

 📁 Project Structure

```text
Personal_Task_Manager/
├── package.json              # Main root package config for concurrently
├── client/                   # Frontend React + Vite
│   ├── public/               # Static assets (icons, favicons)
│   ├── src/
│   │   ├── assets/           # UI media assets (hero.png, logos)
│   │   ├── components/       # Reusable React components
│   │   │   ├── DatabaseViews.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FilterButtons.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskPeekDrawer.jsx
│   │   ├── services/         # API services (api.js)
│   │   ├── utils/            # Helper utilities
│   │   ├── App.jsx           # Main App layout and state manager
│   │   ├── App.css           # Styling rules
│   │   ├── index.css         # Reset & global design variables
│   │   └── main.jsx          # App entry point
│   ├── package.json          # Client dependencies & scripts
│   └── vite.config.js        # Vite bundler configuration
└── server/                   # Backend Express + SQLite
    ├── controllers/          # Request handler controllers
    │   └── taskController.js
    ├── database/             # Database initialization (if any)
    ├── routes/               # API Router setup
    │   └── taskRoutes.js
    ├── db.js                 # SQLite connection client
    ├── server.js             # Main server setup & middleware
    └── package.json          # Server dependencies & scripts
```

---

Installation & Setup Instructions


1. Clone the repository
Open a terminal and navigate to the project directory:
```bash
cd Personal_Task_Manager
```

2. Install all dependencies
You can install dependencies for both the `client` and `server` directories at once using the root command:
```bash
npm run install:all
```
*(This triggers `npm install` inside both `./client` and `./server` sub-folders).*

---

How to Run the App

You can boot up the entire application (both Frontend and Backend) concurrently with a single command:

```bash
npm run dev
```

This will spin up:
- **Backend API Server**: running on [http://localhost:5000](http://localhost:5000)
- **Frontend Vite Dev Client**: running on [http://localhost:5173](http://localhost:5173)

How to Run Frontend Individually
If you want to run only the client interface:
```bash
cd client
npm run dev
```

How to Run Backend Individually
If you want to run only the server:
```bash
cd server
npm run dev
```
*(Or use `npm start` to run with standard Node instead of Nodemon)*

---

PI Documentation

All routes are prefixed with `/api/tasks`.

`GET /api/tasks`
- **Description**: Fetch all tasks, ordered by creation date descending.
- **Request Headers**: `Content-Type: application/json`
- **Response Code**: `200 OK`
- **Response Body**:
  ```json
  [
    {
      "id": 1,
      "title": "Build a Task Manager",
      "description": "Create a fully functional task application.",
      "completed": false,
      "due_date": "2026-06-15",
      "priority": "high",
      "created_at": "2026-06-04 18:25:00",
      "updated_at": "2026-06-04 18:25:00"
    }
  ]
  ```

`POST /api/tasks`
- **Description**: Add a new task to the database.
- **Request Body**:
  ```json
  {
    "title": "Buy Groceries",
    "description": "Get milk, eggs, and bread.",
    "due_date": "2026-06-08",
    "priority": "low"
  }
  ```
- **Response Code**: `201 Created`
- **Response Body**: Returns the created task object (with auto-assigned `id`, `completed` state defaults to `false`, and timestamps).

 `PUT /api/tasks/:id`
- **Description**: Update fields of an existing task.
- **URL Parameter**: `id` - The numeric identifier of the task.
- **Request Body**:
  ```json
  {
    "title": "Buy Organic Groceries",
    "description": "Get almond milk, organic eggs, and bread.",
    "due_date": "2026-06-09",
    "priority": "medium",
    "completed": false
  }
  ```
- **Response Code**: `200 OK`
- **Response Body**: Returns the updated task object.

 `PATCH /api/tasks/:id/toggle`
- **Description**: Toggle the completion status (`completed` true/false) of a task.
- **URL Parameter**: `id` - The numeric identifier of the task.
- **Response Code**: `200 OK`
- **Response Body**: Returns the updated task object containing the inverted status.

`DELETE /api/tasks/:id`
- **Description**: Remove a task permanently from the database.
- **URL Parameter**: `id` - The numeric identifier of the task.
- **Response Code**: `204 No Content`

---


Deployment Section

Frontend Deployment
The React client is configured for static hosting. To build files for production, run:
```bash
cd client
npm run build
```
This generates a production-ready `dist` folder which can be hosted on services like:
- **Vercel**
- **Netlify**
- **GitHub Pages**

Backend Deployment
The Express app can be deployed to Node-friendly hosting providers:
- **Render** / **Railway**
- **Heroku**
- **AWS Elastic Beanstalk**

*Note: Since the database is SQLite, you should configure persistent volumes/mounts to keep `tasks.db` intact on re-deploys, or migrate to PostgreSQL/MySQL for serverless platforms.*

---

Future Improvements

To take this project to the next level, the following features are planned:
* **Drag-and-Drop Task Reordering**: Enable seamless task reorganization and re-prioritization inside the Kanban Board and List views using dragging gestures.
* **Dark/Light Theme Support**: Provide a clean toggle switch to change the appearance of the dashboard between modern dark mode and aesthetic light mode.
* **User Authentication and Authorization**: Integrate a secure login flow (e.g. JSON Web Tokens or OAuth) so multiple users can register, protect their lists, and access their own personalized task dashboards.
* **Task Categories and Tags**: Introduce grouping elements to organize tasks into projects, tags, or workspaces for improved productivity.
* **Overdue Task Indicators**: Display a red "danger" alarm badge or visual warning sign when a task's due date has passed today's date and the task remains uncompleted.

---

