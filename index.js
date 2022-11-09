const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//require mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//require cors 
const cors = require('cors');
const { query } = require('express');

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

    //get review data by id query
    app.get('/reviews', async (req, res) => {
        let query = {};
        if (req.query.reviewId) {
            query = {
                reviewId: req.query.reviewId
            }
        } else if (req.query.email) {
            query = {
                email: req.query.email
            }
        }

        const cursor = reviewCollection.find(query);
        const reviews = await cursor.sort({ reviewDate: -1 }).toArray();
        console.log(reviews);
        res.send(reviews);


    });

    //get the single route
    app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const review = await reviewCollection.findOne(query);
        res.send(review);
    });

}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});