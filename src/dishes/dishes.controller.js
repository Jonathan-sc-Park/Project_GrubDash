const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// Use this function to assign ID's when necessary
// CREATE
const nextId = require("../utils/nextId");
// TODO: Implement the /dishes handlers needed to make the tests pass
//------------------------------------------------------------------------------------------------------------
// LIST
// GET /dishes
function list(req,res) {
    res.json({data: dishes})
}
//------------------------------------------------------------------------------------------------------------
// CREATE
// POST /dishes
// Validation
    // dishBody
    // 201, 400(error message)

function create(req, res) {
    const {data: {name, description, price, image_url} = {}} = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish })    
}
function dishBody(req, res, next) {
  const { data: {name, description, price, image_url} = {} } = req.body;
  if(!name || name === "") {
    return next({
      status: 400,
      message: "Dish must include a name"
    })
  }
  if(!description || description === "") {
    return next({
      status: 400,
      message: "Dish must include a description"
    })
  }
  if(!price) {
    return next({
      status: 400,
      message: "Dish must include a price"
    })
  }
  if(price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0"
    })
  }
  if(!image_url || image_url === "") {
    return next({
      status: 400,
      message: "Dish must include a image_url"
    })
  }
  next();
}
//------------------------------------------------------------------------------------------------------------
// READ
// GET /dishes/:dishId
  // (200)check dish.id === :dishId or (404)no matching found
// validation
  // check dishExists
   // Define res.locals.dish
function read(req, res) {
  res.json({ data: res.locals.dish})
}
function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish)=> dish.id === dishId);
  if(foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not found: ${dishId}`
  })
}
//------------------------------------------------------------------------------------------------------------
// UPDATE
// PUT /dishes/:dishId
// validation 
  // check dishExists (READ)
  // check dishIdExist (404+error msg)
   // Define res.locals.dish
function update(req,res) {
  const { data: {name, description, price, image_url} = {}} = req.body;
  const dish = res.locals.dish;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  
  res.json({data: dish})
}
function dishIdExist(req, res, next) {
  const dishId = req.params.dishId;
  const { data: {id} = {}} = req.body;
  if(!id || id === dishId) {
    return next();
  } 
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
  })
}
//------------------------------------------------------------------------------------------------------------
module.exports = {
  list,
  create: [dishBody, create],
  read: [dishExists, read],
  update: [dishExists, dishBody, dishIdExist, update],
}
