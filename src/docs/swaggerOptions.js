const swaggerOptions = {
  swaggerDefinition: {
    title: "Memory Game API",
    description: "This is an experiment back-end service for a memory game.",
    termsOfService: "http://localhost:3000/api/",
    contact: {
      name: "API Support",
      url: "http://www.example.com/support",
      email: "support@example.com"
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html"
    },
    servers: ["http://localhost:3000"],
    version: "1.0.1"
  },
  apis: ["src/routes/*.js"]
};

module.exports = swaggerOptions;
