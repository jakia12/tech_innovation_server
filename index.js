const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//cors 
const cors = require('cors');

//middlewire

// body parser
app.use(express.json());

//cors
app.use(cors());

app.get('/', (req, res) => {
    res.send('api is runnig ');
});


//mongod db integration

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});