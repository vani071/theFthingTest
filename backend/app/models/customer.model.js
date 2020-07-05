const sql = require("./db");

const Customer = function(customer) {
  this.email = customer.email;
  this.name = customer.name;
  this.is_married = customer.is_married;
  this.password = customer.password;
  this.gender = customer.gender;
  this.address = customer.address;
};

Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO customer SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", { id: res.insertId, ...newCustomer });
    result(null, { id: res.customerId, ...newCustomer });
  });
};

Customer.getAll = result => {
  sql.query("SELECT * FROM customer ORDER BY customer_id DESC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customer: ", res);
    result(null, res);
  });
};

Customer.findById = (customerId, result) => {
  sql.query(`SELECT * FROM customer WHERE customer_id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.updateById = (id, customer, result) => {
  sql.query(
    "UPDATE customer SET email = ?, name = ?, is_married = ?, password = ?, gender = ?, address = ?  WHERE customer_id = ?",
    [customer.email, customer.name, customer.is_married, customer.password, customer.gender, customer.address, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated customer: ", { id: id, ...customer });
      result(null, { id: id, ...customer });
    }
  );
};

Customer.remove = (id, result) => {
  sql.query("DELETE FROM customer WHERE customer_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

module.exports = Customer;