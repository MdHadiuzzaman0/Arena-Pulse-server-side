require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const port = process.env.DATABASE_URL

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db("ArenaPulse");
    const facilityCollection = database.collection("facilities");
    // const bookingCollection = database.collection("bookings");

    //get
    app.get('/facilities', async (req, res) => {
      const result = await facilityCollection.find().toArray()
      res.json(result)
    })

    //get by id
    app.get("/facilities/:id", async (req, res) => {
      const id = req.params.id;
      const idBSON = { _id: new ObjectId(id) }
      const result = await facilityCollection.findOne(idBSON)
      res.json(result)
      // console.log(result)
    })

    //post
    app.post("/facilities", async (req, res) => {
      const newFacility = req.body;
      const result = await facilityCollection.insertOne(newFacility)
      // console.log(result)
      res.json(result)
    })

    //get by email
    app.get("/facilities/:id", async (req, res) => {
    const param = req.params.id;
    if (param.includes('@')) {
        const email = param;
        const result = await facilityCollection.find({owner_email: email}).toArray(); 
        console.log("Fetched by email:", result);
        return res.json(result);
    }})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
