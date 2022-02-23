"use strict";

const express = require("express");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/order.json")

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip } TODO: just pass in req.body
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {

  const result = jsonschema.validate(req.body, orderSchema);
  if (!result.valid) {
    let errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const shipId = await shipProduct(req.body);
  return res.json({ shipped: shipId });
});


module.exports = router;