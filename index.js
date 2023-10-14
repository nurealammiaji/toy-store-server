require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId, FindCursor } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Toy Store Server");
})

app.listen(port, () => {
    console.log(`Toy Store Server is running on port: ${port}`);
})

console.log();

const uri = `mongodb+srv://${username}:${password}@cluster0.31s3qjy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const toysCollection = client.db("toysDB").collection("toys");

    app.get("/toys", async(req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    })

    app.post("/toys", async(req, res) => {
        const toy = req.body;
        console.log(toy);
        const result = await toysCollection.insertOne(toy);
        console.log(result);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
