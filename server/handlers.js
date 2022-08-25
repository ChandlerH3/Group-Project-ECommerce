// Configure the Mongo Client
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const dbName = "Group_Project_E_Commerce";

// Get all of the companies from the database
const allCompanies = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        const allCompanies = await db.collection("companies").find().toArray();

        allCompanies
        ? res.status(200).json({ status: 200, data: allCompanies, message: "Companies data retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Get all of the items from the database
const allItems = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        const allItems = await db.collection("items").find().toArray();

        allItems
        ? res.status(200).json({ status: 200, data: allItems, message: "Items data retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Get all of the categories from the items collection
const allCategories = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        // Return an array of only the item categories
        const retrieveCategories = await (await db.collection("items").find().toArray()).map((items) => {return items.category});

        const allCategories = [];

        for (let i = 0; i < retrieveCategories.length; i++) {
            if (retrieveCategories[i] && allCategories.indexOf(retrieveCategories[i]) === -1) {
                allCategories.push(retrieveCategories[i]);
            }
        };

        allCategories.length > 0
        ? res.status(200).json({ status: 200, data: allCategories, message: "Categories retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Retrieve items based on the category specific in the url params
const allItemsFromSpecificCategory = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { category } = req.params;
    try {
        await client.connect();

        const db = client.db(dbName);

        const categoryItems = await db.collection("items").find({ "category": category }).toArray();

        categoryItems
        ? res.status(200).json({ status: 200, data: categoryItems, message: "Items data from specific category retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Get all of the body_locations from the items collection
const allBodyLocations = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        // Return an array of only the item body_locations
        const retrieveBodyLocation = await (await db.collection("items").find().toArray()).map((items) => {return items.body_location});

        const allBodyLocations = [];

        for (let i = 0; i < retrieveBodyLocation.length; i++) {
            if (retrieveBodyLocation[i] && allBodyLocations.indexOf(retrieveBodyLocation[i]) === -1) {
                allBodyLocations.push(retrieveBodyLocation[i]);
            }
        };

        allBodyLocations.length > 0
        ? res.status(200).json({ status: 200, data: allBodyLocations, message: "Body_locations retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Get the item(s) from the "items" collection using the item id(s) stored in the cart
const cartItemsById = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const itemsToParse = req.query;
    const items = JSON.parse(itemsToParse);
    try {
        await client.connect();

        const db = client.db(dbName);

        const listOfItems = [];
        
        for (let i = 0; i < items?.length; i++) {
            const item = await db.collection("items").findOne({ "_id": items[i]._id });
            listOfItems.push(item);
        }

        listOfItems.length > 0
        ? res.status(200).json({ status: 200, data: listOfItems, message: "Items data retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Retrieve the cart and it's items
const cart = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        const cart = await db.collection("cart").find().toArray();

        cart
        ? res.status(201).json({ status: 200, data: cart, message: "Cart data has been retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    }
    client.close();
};

// Add items to the cart
const addCartItems = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { productId, quantity } = req.body;
    try {
        await client.connect();

        const db = client.db(dbName);

        const { _id, name, price, body_location, category, imageSrc, companyId, numInStock } = await db.collection("items").findOne({ "_id": Number(productId) });

        // Check if there are enough items in stock before adding the item(s) to the cart
        if (numInStock - quantity >= 0) {
            await db.collection("cart").updateOne(
                {},
                { $push: { items: {
                            _id: _id,
                            name: name,
                            price: price,
                            body_location: body_location,
                            category: category,
                            imageSrc: imageSrc,
                            companyId: companyId,
                            quantity: quantity,
                    } 
                }}
            );
            res.status(201).json({ status: 201, message: "Item has been added to the cart." })
        } else {
            res.status(500).json({ status: 500, message: "Error - something went wrong." })
        };
    } catch (error) {
        console.log("Error :", error);
    }
    client.close();
};

// Remove items from the cart
const removeCartItems = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { productId } = req.body;
    try {
        await client.connect();

        const db = client.db(dbName);

        const removeItem = await db.collection("cart").updateOne(
            {},
            { $pull: { items: {
                    _id: Number(productId),
                } 
            }}
        );

        removeItem
        ? res.status(201).json({ status: 201, message: "Item has been removed from the cart." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    }
    client.close();
};

// Get a specific purchase by purchase ID
const purchaseConfirmationById = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { purchaseId } = req.params;
    try {
        await client.connect();

        const db = client.db(dbName);

        const specificPurchase = await db.collection("purchases").findOne({ _id: purchaseId });

        specificPurchase
        ? res.status(200).json({ status: 200, data: specificPurchase, message: "Purchase data retrieved successfully." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

// Create and post a new purchase and assign it a random purchase ID
const newPurchaseConfirmation = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const newPurchaseId = uuidv4(); // random purchase Id generator
    const { total,
            firstName,
            lastName,
            creditCardNum,
            creditCardExp,
            postalCode,
            timeStamp, // record date and time stamp when the user submits the purchase
        } = req.body;
    try {
        await client.connect();

        const db = client.db(dbName);

        const cart = await db.collection("cart").findOne();
        const items = await cart.items;

        // Purchase will be stored in mongodb "purchases" collection in the following format
        const newPurchase = {
            _id: newPurchaseId,
            items: items,
            total: total,
            firstName: firstName,
            lastName: lastName,
            creditCardNum: creditCardNum,
            creditCardExp: creditCardExp,
            postalCode: postalCode,
            timeStamp: timeStamp,
        };

        const addNewPurchase = await db.collection("purchases").insertOne(newPurchase);

        // Go through each item of the items array and decrease the number of items from the item stock quantity.
        for (let item = 0; item < items?.length; item++) {
            const itemId = items[item]._id;
            const qty = items[item].quantity
            await db.collection("items").updateOne(
                {_id: itemId},
                { $inc: {numInStock: -qty} }
            );
        };

        // Clear the cart items.
        for (let item = 0; item < items?.length; item++) {
            const itemId = items[item]._id;
            await db.collection("cart").updateOne(
                {},
                { $pull: { items: {
                        _id: itemId,
                    } 
                }}
            );
        };

        addNewPurchase
        ? res.status(201).json({ status: 201, data: newPurchase, message: "Purchase confirmed." })
        : res.status(500).json({ status: 500, message: "Error - something went wrong." })
    } catch (error) {
        console.log("Error :", error);
    };
    client.close();
};

module.exports = { 
                    allCompanies,
                    allItems,
                    allCategories,
                    allItemsFromSpecificCategory,
                    allBodyLocations,
                    cartItemsById,
                    cart,
                    addCartItems,
                    removeCartItems,
                    purchaseConfirmationById,
                    newPurchaseConfirmation
                };
