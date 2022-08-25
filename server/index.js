'use strict';

const express = require('express');
const morgan = require('morgan');

const PORT = 4000;

// Access functions from the handlers file
const { allCompanies, 
        allItems,
        allCategories,
        allItemsFromSpecificCategory,
        allBodyLocations,
        cartItemsById,
        cart,
        addCartItems,
        removeCartItems,
        purchaseConfirmationById,
        newPurchaseConfirmation, 
      } = require("./handlers");

express()
  .use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, HEAD, GET, PUT, POST, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('./server/assets'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))

  // Retrieve all of the companies from the MongoDb database
  .get("/companies", allCompanies)

  // Retrieve all of the items from the MongoDb database
  .get("/items", allItems)

  // Retrieve all of the categories from the items collection
  .get("/items/categories", allCategories)

  // Retrieve all of the items from the items collection based on the provided category
  .get(`/items/categories/:category`, allItemsFromSpecificCategory)

  // Retrieve all of the body_locations from the items collection
  .get("/items/body_locations", allBodyLocations)

  // Retrieve item(s) from the cart using the item Ids
  .get("/cart-items/:id", cartItemsById)

  // Retrieve contents of the cart
  .get("/cart-items", cart)

  // Add items to the cart
  .post("/cart-items", addCartItems)

  // Remove items from the cart
  .patch("/cart-items", removeCartItems)

  // Retrieve a specific purchase by Id
  .get("/purchases/:purchaseId", purchaseConfirmationById)

  // Create new purchase confirmation for client to view after payment is confirmed and update item stock
  .post("/purchases/new-purchase", newPurchaseConfirmation)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
