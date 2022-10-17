import express, { text } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';



let todoSchema = new mongoose.Schema({
    text:{ type: String, required: true}, // String is shorthand for {type: String}
    classId: String,
    CreatedOn: { type: Date, default: Date.now },
  });

  const todoModel = mongoose.model('todos', todoSchema);

const app = express()
const port = process.env.PORT || 3000;




app.use(express.json());
app.use(cors())

/////////////////////////push///////////////////////////////////

app.post('/todo', (req, res) => {

    todoModel.create({ text: req.body.text }, (err, saved) => {
        if (!err) {
            console.log(saved);

            res.send({
            message:"your todo is saved",
            
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    })
});

/////////////////////////get///////////////////////////////////

app.get('/todos', (req, res) => {

    todoModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "here is you todo list",
                data: data
            })
        }else{
            res.status(500).send({
                message: "server error"
            })
        }
    });
})


/////////////////////////Update///////////////////////////////////
app.put('/todo/:id', async (req, res) => {

    try {
        let data = await todoModel
            .findByIdAndUpdate(
                req.params.id,
                { text: req.body.text },
                { new: true }
            )
            .exec();

        console.log('updated: ', data);

        res.send({
            message: "todo is updated successfully",
            data: data
        })

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})

/////////////////////////delete///////////////////////////////////

app.delete('/todo/:id', (req, res) => {
    let id = req.params.id

    todoModel.deleteOne({id}, (err, data) => {
        if (!err) {
            console.log(data)
            res.send({
                message: 'here is Delete todo',
               
            })
if(data.deletedCount !== 0)
{
    res.send({
        message:"todo has been deleted successfully",

    })
}else{
    res.send({
        message:"No todo has been found with this id"+id,

    })
}
        } else {
            res.status(500).send({
                message: "Server Error"
            })

        }
    })

})

/////////////////////////All delete///////////////////////////////////

app.delete('/todos', (req, res) => {

    todoModel.deleteMany({}, (err, data) => {
        if (!err) {
            res.send({
                message: "All Todo has been deleted successfully",
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.listen(port, () => {

    console.log(`${port}`)
})

/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://abc:abc@cluster0.xvlqw1d.mongodb.net/abcdatabase?retryWrites=true&w=majority';

mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});