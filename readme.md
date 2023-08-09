<h1 align="center">Syrup</h1>

<p align="center">
    <a href="#syrup"><img src="https://img.shields.io/badge/-Syrup-brightgreen?style=for-the-badge" alt="Syrup"/></a>
    <a href="#core-features"><img src="https://img.shields.io/badge/-Core%20Features-blue?style=for-the-badge" alt="Core Features"/></a>
    <a href="#getting-started-with-syrup"><img src="https://img.shields.io/badge/-Getting%20Started-yellow?style=for-the-badge" alt="Getting Started"/></a>
    <a href="#project-structure"><img src="https://img.shields.io/badge/-Project%20Structure-orange?style=for-the-badge" alt="Project Structure"/></a>
    <a href="#contributing"><img src="https://img.shields.io/badge/-Contributing-red?style=for-the-badge" alt="Contributing"/></a>
    <a href="#syrups-roadmap"><img src="https://img.shields.io/badge/-Syrup%27s%20Roadmap-lightgrey?style=for-the-badge" alt="Syrup's Roadmap"/></a>
    <a href="#license"><img src="https://img.shields.io/badge/-License-lightblue?style=for-the-badge" alt="License"/></a>
    <a href="#contact"><img src="https://img.shields.io/badge/-Contact-purple?style=for-the-badge" alt="Contact"/></a>
</p>

Welcome to Syrup, an advanced, feature-rich backend framework architectured on Koa and Sequelize. Syrup is designed to push the boundaries of web development by leveraging the power of TypeScript, providing a strongly-typed, developer-friendly environment. With an array of custom-built systems and utilities, Syrup takes server development to the next level by handling all its complexities, allowing you to focus on creating incredible applications.

<h2 id='core-features'>🌟 Core Features</h2>

- 🏗️ **Robust Server Foundation**: A steadfast core server offering unparalleled stability, performance, security, and scalability.
- 🛠️ **Seamless Configuration**: A simplified, yet flexible, configuration process providing sensible defaults and complete customization.
- 🔒 **Flexible Authentication**: A configurable base auth system and User model that can be easily adapted to suit your application's needs.
- 🛡️ **Secure by Design**: A dedicated focus on secure mechanisms and implementations to fortify your application.
- 🎟️ **Session Mastery**: Efficient management of user sessions, ensuring a smooth and seamless user experience.
- 📄 **Integrated JWT Authentication**: Easy integration of JWT authentication, providing secure access and protection for your resources.
- 🧮 **Decorator-Driven Simplification**: Simplified and readable code with our decorator-based helpers.
- 📜 **Automated API Documentation**: Automated, comprehensive, and easy-to-understand Swagger documentation for your APIs.
- 🏛️ **Auto-Generated Schemas**: Automatic schema generation ensuring database consistency with your data models.
- 🕵️ **Tracing & Error Handling**: Efficient error tracing and handling, making debugging easier and improving application reliability.
- 📚 **Structured Logging & Archiving**: Monitor your application's behavior with structured logging and long-term storage for analysis.
- 🖼️ **Admin Panels**: Easy access and use of your ORM's metadata through built-in admin panels, simplifying administrative tasks.
- 📈 **Built-In Analytics & Monitoring**: Built-in support for Prometheus or Grafana endpoints with Opentelemetry for monitoring and analyzing application metrics.
- 🧰 **Middleware Excellence**: Seamless request handling with a suite of middleware solutions, including structured logging, error handling, and consistent server responses.
- 🚀 **API-Driven Routing**: Simplified process of defining controllers and routes with an API that auto-generates CRUD functionality.
- 📊 **Resource Monitoring & AI-Based Anomaly Detection**: Built-in resource monitoring, logging, and check endpoints. Anomaly detection system using machine learning for data anomaly detection.
- ⏰ **Event-Driven Scheduling**: Easy scheduling of cron jobs and comprehensive server-based event hooks for event-driven programming.
- 📈 **Insightful Analysis & Reports**: Deep insights into your application with automatic analysis and reports for queries, requests, RBAC access, model audit logs, and errors.
- 🗄️ **Customizable Caching**: Choose the caching solution that suits you best, with Etag support, Redis clients, or an in-memory LFU or LRU cache.
- 📚 **Flexible Database Support**: Seamless integration with various SQL-based database dialects for maximum data storage flexibility and performance.
- 🛡️ **Data Integrity & Health Checks**: Ensure the integrity of your data with our custom validation library and comprehensive health checks API.
- 💻 **Command Line Mastery**: Speed up your development process with our CLI suite, capable of generating everything from projects and hooks to models, routes, and controllers.
- 🏢 **Consistent Project Structure**: Enjoy a consistent, intuitive, and efficient development experience thanks to our well-maintained project structure.

<h2 id='getting-started-with-syrup'>🚀 Getting Started with Syrup</h2>

Embark on your journey with Syrup! Below are the steps to set up your development environment and start using this feature-rich framework.

### 🧰 Prerequisites

To ensure a smooth setup, please ensure the following prerequisites:

- **Node.js & npm**: Ensure you have the latest version of Node.js and npm installed. You can download Node.js from their [official website](https://nodejs.org/), which will also include npm.

- **TypeScript Knowledge**: Familiarity with TypeScript is recommended as Syrup leverages TypeScript for a strongly-typed, developer-friendly environment.

### 📦 Installation

Installing Syrup is just a few commands away. Follow the steps below:

1. **Clone the repository**: Start by cloning the Syrup repository to your local machine using Git:

```bash
git clone https://github.com/Paintersrp/syrup-core.git
```

2. **Navigate into the project directory**: Change your current directory to the cloned repository:

```bash
cd syrup-core
```

3. **Install the dependencies**: Use npm to install all the necessary packages and dependencies:

```bash
npm install
```

And voila! You have successfully installed Syrup on your machine.

### 🎮 Usage

Excited to see Syrup in action? Follow these steps:

1. **Run the server**: Start the Syrup server with the following command:

```bash
npm run start
```

2. **Access the Application**: Open your web browser and navigate to `http://localhost:3000`. Enjoy exploring the application!

Remember, Syrup is all about streamlining and supercharging your web development process. Enjoy the journey!

<h2 id='project-structure'>🚀 Project Structure</h2>

Our project structure prioritizes developer experience with a clear separation of backend and frontend files. Frontend structure is recommended, but not opinionated within the CLI.

### 🎛️ Backend Structure:

- `src/controllers`: Houses logic needed for handling incoming requests and sending responses.
- `src/docs`: Contains auto-generated Swagger documentation for your APIs.
- `src/logs`: Stores structured logs for monitoring the application's behavior.
- `src/models`: Defines the structure of your database tables in Sequelize.
- `src/routes`: Defines the endpoints of your application where requests are sent.
- `src/schemas`: Handles automatic generation of database schemas.
- `src/settings`: Stores configuration details and settings for your application.
- `src/types`: Contains custom TypeScript types used across the application.
- `.env`: Stores environment variables for your application.
- `main.ts`: The entry point of your application.

### 🎨 Frontend Structure (Bulletproof React Structure):

- `src/components`: Contains all the React components used in the application.
- `src/features`: Houses the main features of your application, divided into separate modules.
- `src/hooks`: Stores custom React hooks used throughout your application.
- `src/libs`: Contains any libraries or utilities used across your application.
- `src/providers`: Defines React context providers.
- `src/routes`: Defines the routing structure of your application.
- `src/settings`: Stores configuration details and settings for your application.
- `src/stores`: Contains Zustand states for state management.
- `src/theme`: Contains styling and theming details for your application.
- `src/types`: Contains custom TypeScript types used across the application.
- `src/utils`: Stores utility functions used across the application.
- `App.tsx`: The main React component that starts your application.
- `index.html`: The HTML file that serves as the entry point of your application.
- `main.tsx`: The entry point of your application.
- `App.css`: Contains global CSS styles for your application.

This structured environment ensures a clear separation of concerns, making it easy to locate files and work on different parts of the application independently.

<h2 id='contributing'>🤝 Contributing</h2>

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

<h2 id='syrups-roadmap'>🛣️ Syrup's Roadmap</h2>

At Syrup, we are always brewing new features to supercharge your web development journey even further. Our roadmap illustrates the ambitious trajectory we have planned. Here's a preview of what's on the horizon:

### 🚀 **GraphQL Integration**

We're broadening our horizons by integrating GraphQL. This will empower you to construct more flexible, client-driven APIs, ensuring efficient data loading and better overall performance.

### 🏢 **Microservices Architecture Support**

To enhance scalability and foster independent development, we're laying the groundwork for a robust microservices architecture. This will allow different teams to work on separate services, boosting productivity, and deployment speed.

### ⚡ **Real-Time Data Handling**

We're driving towards a more interactive web by introducing real-time data handling capabilities. This will unlock a plethora of dynamic features such as live chat, real-time notifications, live updates, and more.

### 📦 **Serverless Deployment**

To ensure scalability and cost-effectiveness, we're setting our sights on serverless deployment. This will allow your applications to scale seamlessly, ensuring you only pay for the resources you use.

### 🐳 **Docker and Kubernetes Support**

We're bolstering our deployment capabilities by integrating Docker and Kubernetes support. This will simplify and streamline the process of deploying, scaling, and managing containerized applications.

### 🗄️ **NoSQL Database Support**

In addition to SQL, we plan to extend our support to NoSQL databases like MongoDB. This will provide you with more flexible and scalable data storage solutions to meet diverse application needs.

This roadmap is a testament to our commitment to making Syrup the go-to framework for web development. Please note that these plans may evolve based on community feedback and changing technology landscapes.

We welcome contributions to help us realize this vision. If you're as excited about these features as we are and want to contribute, please feel free to submit pull requests or suggest new ideas. Let's brew the future of web development together with Syrup!

<h2 id='license'>📜 License</h2>

This project is licensed under the MIT License.

<h2 id='contact'>📞 Contact</h2>

If you want to contact me, you can reach me at Paintersrp@gmail.com.

---
