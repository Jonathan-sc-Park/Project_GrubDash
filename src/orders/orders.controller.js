const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
// TODO: Implement the /orders handlers needed to make the tests pass

//-----------------------------------------------------------------------
// LIST
// GET /orders
function list(req, res) {
  res.json({ data: orders });
}

//-----------------------------------------------------------------------
// CREATE
// POST /orders
// Validation
  // orderBody
  // 201, 400(error message)

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}
function orderBody(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  if (!deliverTo || deliverTo === "") {
    return next({
      status: 400,
      message: "Order must include a deliverTo",
    });
  }
  if (!mobileNumber || mobileNumber === "") {
    return next({
      status: 400,
      message: "Order must include a mobileNumber",
    });
  }
  if (!dishes) {
    return next({
      status: 400,
      message: "Order must include a dish",
    });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  dishes.map((dish, index)=> {
    if(!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`
      })
    }
  })
  next();
}

//-----------------------------------------------------------------------
// READ
// GET /orders/:orderId
  // (200)check order.id === :orderId or (404)no matching found
// validation
  // check orderExists
   // Define res.locals.order
   function read(req, res) {
    res.json({ data: res.locals.order})
  }



//-----------------------------------------------------------------------
// UPDATE
// PUT /orders/:orderId
// validation 
  // check orderExists (READ)
  // check orderIdExist (404+error msg)
   // Define res.locals.order
function update(req,res) {
  const { data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body;
  const order = res.locals.order;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  
  res.json({data : order})
}
function orderIdExist(req, res, next) {
  const orderId = req.params.orderId;
  const { data: {id, status} = {}} = req.body;
  let message
  if(id && id !== orderId) {
      message = `Order id does not match route id. Order: ${id}, Route: ${orderId}.`
  } 
  if(!status || status === "" || (status !== "pending" && status !== "preparing" && status !== "out-for-delivery")) {
      message = `Order must have a status of pending, preparing, out-for-delivery, delivered`
  }
  if(status === "delivered") {    
      message = `A delivered order cannot be changed`
  }
  
  if(message) {
    return next({
      status: 400,
      message: message
    })
  }
  
  next();
} 
    
  function orderExists(req, res, next) {
    const orderId = req.params.orderId;
    const foundOrder = orders.find((order)=> order.id === orderId);
    if(foundOrder) {
      res.locals.order = foundOrder;
      return next();
    }
    next({
      status: 404,
      message: `Order does not exist: ${orderId}`
    })
  }

//-----------------------------------------------------------------------
// DELETE(DESTROY)
// DELETE /orders/:orderId
// destroyCheck
function destroy(req,res) {
  const orderId = req.params.orderId;
  const index = orders.findIndex((order) => order.id === orderId)

  if(index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204)
}

function destroyCheck(req, res, next) {
  if(res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending. Returns a 400 status code`
    })
  }
  next();
}


//-----------------------------------------------------------------------
module.exports = {
  list,
  create: [orderBody, create],
  read: [orderExists, read],
  update: [orderExists, orderBody, orderIdExist, update],
  delete: [orderExists, destroyCheck, destroy],

};
