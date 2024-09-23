
# Nest.js Application

This is a Nest.js application that [briefly describe what the app does]. Follow the steps below to install, configure, and run the project.

## Prerequisites

Before installing the project, ensure that you have the following installed on your machine:

- **Node.js** (version 16.x or later) - [Download Node.js](https://nodejs.org/)
- **npm** (Node package manager) or **yarn** (optional)
- **Nest.js CLI** (optional, but recommended) - Install globally by running:
  
  ```bash
  npm install -g @nestjs/cli
  ```

To check if Node.js and npm are installed, run the following commands:

```bash
node -v
npm -v
```

## Installation

Follow the steps below to clone the repository, install dependencies, and run the app.

### 1. Clone the Repository

```bash
git clone https://github.com/edwardo1239/prueba_Inlaze_back_end
cd prueba_Inlaze_back_end
```

### 2. Install Dependencies

Using `npm`:

```bash
npm install
```

Or, using `yarn`:

```bash
yarn install
```

### 3. Environment Variables

Make sure to set up your environment variables in a `.env` file at the root of your project. Create the file if it doesn't exist and add the required variables. For example:

```bash
JWT_SECRET=your_jwt_secret_here
```

Replace  `your_jwt_secret_here` with the actual values for your project.

### 4. Run the Development Server

Start the Nest.js development server by running:

```bash
npm run start:dev
```

Or, with `yarn`:

```bash
yarn start:dev
```

Your app will now be running at `http://localhost:3001`.

### 5. Build for Production (Optional)

To build the application for production, use the following command:

```bash
npm run build
```

Or, with `yarn`:

```bash
yarn build
```

After building, you can start the production server with:

```bash
npm run start:prod
```

Or, with `yarn`:

```bash
yarn start:prod
```

## Useful Commands

- **`npm run start:dev`**: Runs the app in development mode with live reload.
- **`npm run build`**: Builds the app for production.
- **`npm run start:prod`**: Runs the app in production mode.
- **`npm run lint`**: Runs ESLint to check for linting errors.
- **`npm run test`**: Runs tests using Jest.

## Learn More

To learn more about Nest.js, take a look at the following resources:

- [Nest.js Documentation](https://docs.nestjs.com/) - Learn about Nest.js features and API.
- [Nest.js CLI Documentation](https://docs.nestjs.com/cli/overview) - Learn how to use the Nest.js CLI.

## License

This project is licensed under the [MIT License](LICENSE).

