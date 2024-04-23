const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const app=express();
const port=3000;
//Middleware
//for parsing the data 
app.use(express.json());
// if it is in same folder
app.use(express.static('./public'));
// or not in same in folder
//app.use
//connecting node to mongodb
//we can use localhost instead of 127.0.0.1
mongoose.connect('mongodb+srv://anishalathwal:12345@cluster0.ac2gp2x.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('Connnected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB:',err));


//Define user schema
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
const User=mongoose.model('User',userSchema);
//route handlers
app.get('/users',(req,res)=>
{
    User.find({})
    .then(users=>res.json(users))
    .catch(err=>res.status(500).json({message:err.message}));
});

app.listen(port,()=>
{
    console.log("Server is running on port no 3000");
});

app.post('/users',(req,res)=>
{
    const user=new User({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    user.save()
    .then(newUser=>res.status(201).json(newUser))
    .catch(err=>res.status(400).json({message:err.message}));
});

app.put('/users/:id',(req,res)=>
{
    const userId=req.params.id;
    const updateData={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    };
//By passing { new: true }, 
//you ensure that the function returns the most up-to-date version of the document, 
//which can be useful when you need to work with the updated data immediately after making changes.
// Always handle possible errors, especially when the specified ID is not found in the database1.
    User.findByIdAndUpdate(userId,updateData,{new:true})
    .then(updatedUser=>
    {
        if(!updatedUser)
        {
            return res.status(404).json({message:'User not found'});
        }
        res.json(updatedUser);
    })
    .catch(err=>res.status(400).json({message:err.message}));
});


app.delete('/users/:id',(req,res)=>
{
    const userId=req.params.id;
    User.findByIdAndDelete(userId)
    .then(deletedUser=>
    {
        if(!deletedUser)
        {
            return res.status(404).json({message:'User not found'});
        }
        res.json({message:'User deleted successfully'});
    })
    .catch(err=>res.status(400).json({message:err.message}));
});