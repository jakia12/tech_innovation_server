const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//require mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//require cors 
const cors = require('cors');

//require dotenv
require('dotenv').config();

//middlewire

// body parser
app.use(express.json());

//cors
app.use(cors());

app.get('/', (req, res) => {
    res.send('api is runnig ');
});


//mongod db integration

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const serviceCollection = client.db('it-innovation').collection('services');

    //review collection
    const reviewCollection = client.db('it-innovation').collection('reviews');

    //get service data from the database
    app.get('/services', async (req, res) => {
        const num = parseInt(req.query.num);
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(num).toArray();
        res.send(services);

    });

    //get single service route
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
    });


    //review data insert to the database
    app.post('/reviews', async (req, res) => {
        const review = req.body;
        console.log(review);
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    })


}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});