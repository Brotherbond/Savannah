# RetailCart

A simple Retail Cart application with discount functionalities.

## Demo
[Live Demo](https://savannah-one.vercel.app/cart)

## References
[Project Documentation](https://docs.google.com/document/d/1E-flnUNo1G6XSPs23czHIvOKf4gJy3rO3oRsYJJJKpc/edit?tab=t.0#heading=h.196oxh3t5u7c)

---

## Getting Started

### 1. Running the Project with Docker
If you prefer a containerized setup, you can run the project using Docker Compose. Ensure you have Docker installed on your machine before proceeding.

#### Steps:
1. Navigate to the project directory in your terminal.
2. Run the following command:
   ```sh
   docker compose up
   ```
   This will automatically build and start the required services for both the frontend (Angular) and backend.
3. Once the services are up, open `http://localhost:4200/` in your browser to access the application.
4. To stop the services, press `Ctrl + C` in the terminal or run:
   ```sh
   docker compose down
   ```

---

### 2. Running the Project Manually
If you prefer a traditional setup without Docker, follow these steps.

#### Installation
1. Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.
2. Navigate to the project directory.
3. Install dependencies:
   ```sh
   pnpm install
   ```

#### Running Both 
Run  ```pnpm concurrently```




#### Running the Frontend (Angular)
1. Start the Angular development server:
   ```sh
   ng serve
   ```
2. Open `http://localhost:4200/` in your browser. The application will automatically reload if you make changes to the source files.

#### Running the Backend Server
1. Start the backend server:
   ```sh
   pnpm run server
   ```

---

## Building the Project
To create a production-ready build:
```sh
ng build
```
The build artifacts will be stored in the `dist/` directory.

---

## Running Tests
Run unit tests using Karma:
```sh
ng test
```

---

## Notes
- Ensure your backend server is running when using the frontend.
- Modify environment configurations if needed before deploying the project.

---

Happy Coding! 🚀

