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

const companyData = require("./data/companies.json");
const itemData = require("./data/items.json");

// Function used to import the companies data into the MongoDb database collection "companies".
const batchImportCompanies = async () => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        const addCompanies = await db.collection("companies").insertMany(companyData);

        const companiesAdded = await db.collection("companies").find().toArray();

        companiesAdded.length === 0
        ? console.log("Error: Items were not added to the database.")
        : console.log("Success: Items were added to the database.", addCompanies );
    } catch (error) {
        console.log("Error :", error);
    }
    client.close();
};

// batchImportCompanies();

// Function used to import the items data into the MongoDb database collection "items".
const batchImportItems = async () => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();

        const db = client.db(dbName);

        const addItems = await db.collection("items").insertMany(itemData);

        const itemsAdded = await db.collection("items").find().toArray();

        itemsAdded.length === 0
        ? console.log("Error: Items were not added to the database.")
        : console.log("Success: Items were added to the database.", addItems );
    } catch (error) {
        console.log("Error :", error);
    }
    client.close();
};

// batchImportItems();