const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//require mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');


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


}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});