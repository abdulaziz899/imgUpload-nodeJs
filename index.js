const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w8vla.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 5055;



app.get('/', (req, res) => {
  res.send('Hello World!')
})


client.connect(err => {
  const collection = client.db("imgLoad").collection("images");
  console.log("data base connect ");


  app.post('/addEvents',(req,res)=>{
    const event=req.body;
    console.log("adding new event ",event);
    collection.insertOne(event)
    .then(result=>{
      console.log(result.insertedCount);
      res.send(result.insertedCount>0)
    })
  })

app.get('/showEvent',(req,res)=>{
  collection.find({})
  .toArray((err,documents)=>{
    console.log(documents);
    res.send(documents)
  })
})

app.delete('/deleteEvent/:id',(req,res)=>{
  const id=ObjectId(req.params.id);
  console.log('delete id ',id);
  collection.findOneAndDelete({_id:id})
  .then(documents=>{
    //res.send(!!documents)
  })
})

});


app.listen(port)
