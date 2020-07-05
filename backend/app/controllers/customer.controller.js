const Customer = require("../models/customer.model");
const Response = require("../models/response.model");

// Create and Save a new Customer
exports.create = (req, res) => {
   // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const customer = new Customer({
    email: req.body.email,
    name: req.body.name,
    is_married : req.body.is_married,
    password : req.body.password,
    gender : req.body.gender,
    address : req.body.address,
  });

  // Save Customer in the database
  Customer.create(customer, (err, data) => {
    if (err)
       res.status(500).send(new Response(500,"failed",`error getting data`,err));

    else res.send(new Response(200,"success",`successfully create customer. (name : ${data.name})`,data));
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send(new Response(500,"failed",`error getting data`,err));
    else res.send(new Response(200,"success",`get ${data.length} data`,data));
  });
};

exports.findOne = (req, res) => {
  Customer.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
      res.status(404).send(new Response(404,"failed",`customer data not found`,err));
      } else {
       res.status(500).send(new Response(500,"failed",`error getting data`,err));
      }
    } else res.send(new Response(200,"success",`get customer detail data`,data));
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send(new Response(404,"failed",`request cannot be empty`,err));
  }

  Customer.updateById(
    req.params.customerId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
           res.status(404).send(new Response(404,"failed",`customer data not found`,err));
        } else {
          res.status(500).send(new Response(500,"failed",`error getting data`,err));
        }
      } else res.send(new Response(200,"success",`success update customer data id: ${req.params.customerId}`,data));
    }
  );
};

exports.delete = (req, res) => {
  Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send(new Response(404,"failed",`customer data not found`,err));
      } else {
        res.status(500).send(new Response(500,"failed",`error getting data`,err));
      }
    } else res.send(new Response(200,"success",`success delete customer data id: ${req.params.customerId}`,{id:req.params.customerId}));
  });
};