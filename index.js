const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d18ofon.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const collegesCollection = client.db('campusDb').collection('colleges');

        app.get('/colleges/rating/:minRating', async (req, res) => {
            const minRating = parseFloat(req.params.minRating);

            const result = await collegesCollection.find({ rating: { $gte: minRating } }).toArray();

            res.json(result);

        })

        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray();
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



app.get('/', (req, res) => {
    res.send('Campus Snap is running');
})

app.listen(port, () => {
    console.log(`Campus snap is running on port: ${port}`);
})
