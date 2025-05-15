const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@allhere.kcbc43d.mongodb.net/?retryWrites=true&w=majority&appName=AllHere`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const teamCollection = client.db("teamdata").collection("team");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/teams/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await teamCollection.findOne(query);
  res.send(result);
});

app.post("/addteam", async (req, res) => {
  const newData = req.body;
  const result = await teamCollection.insertOne(newData);
  res.send(result);
});

app.get("/teams", async (req, res) => {
  const result = await teamCollection.find().toArray();
  res.send(result);
});

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});
