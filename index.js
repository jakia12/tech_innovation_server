const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//require mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//require json web token
const jwt = require('jsonwebtoken');

//require cors 
const cors = require('cors');
// const { query } = require('express');

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

//verfify jwt 

function verifyjwt(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    // if (!authHeader) {
    //     return res.status(401).send({ message: 'unauthorized access' });
    // }
    // const token = authHeader.split(' ')[1];

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    //     if (err) {
    //         return res.status(403).send({ message: 'Forbidden access' });
    //     }
    //     req.decoded = decoded;
    //     
    // })
    next();

}


async function run() {
    const serviceCollection = client.db('it-innovation').collection('services');

    //review collection
    const reviewCollection = client.db('it-innovation').collection('reviews');


    //jwt authentication
    // app.post('/jwt', (req, res) => {
    //     const user = req.body;

    //     const token = jwt.sign(user, process.env.ACCES_TOKEN_SECRET, { expiresIn: '1d' });

    //     res.send({ token });
    // });

    //get service data from the database
    app.get('/services', async (req, res) => {
        const num = parseInt(req.query.num);
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(num).toArray();
        res.send(services);

    });

    //insert services to the database 
    app.post('/services', async (req, res) => {
        const service = req.body;
        console.log(service);
        const result = await serviceCollection.insertOne(service);
        res.send(result);
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

        const result = await reviewCollection.insertOne(review);
        res.send(result);
    })

    //get review data by id query
    app.get('/reviews', async (req, res) => {
        // console.log(req.headers.authorization);

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
        // console.log(reviews);
        res.send(reviews);


    });

    //get the single route
    app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const review = await reviewCollection.findOne(query);
        res.send(review);
    });

    //delete single review
    app.delete('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const review = await reviewCollection.deleteOne(query);
        res.send(review);
    });

    //update the review 
    app.put("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const review = req.body;
        const option = { upsert: true };
        const updatedReview = {
            $set: {
                name: review.name,
                rating: review.rating,
                text: review.text
            }
        }
        const result = await reviewCollection.updateOne(query, updatedReview, option);
        res.send(result);
    });
}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});