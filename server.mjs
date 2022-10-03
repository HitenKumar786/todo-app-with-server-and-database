import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
await mongoose.connect('');


const app = express()
const port = process.env.PORT || 3000;

let todos = [];




app.use(express.json());
app.use(cors())



app.post('/todo', (req, res) => {

    todos.push(req.body.text);

    res.send({

        message: "Your todo is Saved",
        data: todos
    })


})
app.get('/todos', (req, res) => {

    res.send({
        message: "Here is your todos List",
        data: todos

    })
})

app.listen(port, () => {

    console.log(`${port}`)
})