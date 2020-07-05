module.exports = app => {
  const customers = require("./controllers/customer.controller");

  // Create a new Customer
  app.post("/customer", customers.create);

  // Retrieve all Customer
  app.get("/customer", customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customer/:customerId", customers.findOne);

  // Update a Customer with customerId
  app.put("/customer/:customerId", customers.update);

  // Delete a Customer with customerId
  app.delete("/customer/:customerId", customers.delete);

};