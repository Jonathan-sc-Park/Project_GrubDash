// dishes
  // dishes.controller.js
    // List     GET /dishes           { data: [{ id, name, description, price, image_url }] }  
    // Create   POST /dishes          If fail(status: 400 + error message) else(status: 201)
    // Read     GET /dishes/:dishId   (+ dishExists) (200)check dish.id === :dishId or (404)no matching found
    // Update   PUT /dishes/:dishId   update dish.id === :dishId or (404)no matching found
                POST /dishes           validation :dishId not exist(`Dish does not exist: ${dishId}.`)
                                                  id not match with :dishId route(`Dish id does not match route id. Dish: ${id}, Route: ${dishId}`)
    // Delete(X)
  // dishes.router.js("/dishes", "/dishes/:dishId")
    // Create, Read, Update, List from "/dishes.controller"


//orders
  // orders.controller.js
    // List     GET /orders           { data: [{ id, deliverTo, mobileNumber, status, dishes}]}                 
    // Create   POST /orders          If fail(status: 400 + error message) else(status: 201)
    // Read     GET /orders/:orderId  (+ orderExists) (200)check order.id === :oderId or (404)no matching found
    // Update   PUT /orders/:orderId  update order.id === :orderId or (404)no matching found
                POST /orders          validation id not match :orderId(`Order id does not match route id. Order: $   {id}, Route: ${orderId}.`)
                                      status(`Order must have a status of pending, preparing, out-for-delivery, delivered`)
                                      status === "delivered (`A delivered order cannot be changed`)
    // Delete   DELETE /orders/:orderId     (204) or (404)no matching order is found.
                                            (``)
 
  // orders.router.js("/orders", "/orders/:orderId")
    // Create, Read, Update, Delete, List from "/orders.controller"

// errors
  // errorHandler.js
  // methodNotAllowed.js: 405
  // notFound.js: 404

// utils/nextId.js (Change X)
  // Export the nextId function. sue anytime you need to assign a new id.

