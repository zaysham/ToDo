const express = require ("express"); 
const path = require('path'); 
const mongoose = require('mongoose'); 
const Todo = require('./models/list'); 
const ejsMate = require ('ejs-mate'); 
const methodOverride = require ('method-override');
const seeds = require ('./seeds/seeds.js'); 

main().catch(err => console.log(err));

async function main() {
 await mongoose.connect('mongodb://127.0.0.1:27017/ToDo');
}


const app = express(); 
app.use(methodOverride('_method')); 

app.use(express.urlencoded({extended:true}));  //needed to parse URL data to create new todo 

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
app.engine('ejs', ejsMate); 
app.use(express.static(__dirname + '/public'));


app.get('/todo', async (req, res)=>{
    const todos = await Todo.find({}); 
    res.render('index', {todos}); 
})


app.post('/todo', async (req, res)=>{
    const newTodo = await Todo(req.body); 
    await newTodo.save(); 
    res.redirect('todo'); 
})

app.delete('/todo/:id', async (req, res)=>{
    const {id} = req.params; 
    const todo = await Todo.findByIdAndDelete(id); 
    
    res.redirect('/todo'); 
   
})



app.get('/todo/:id/edit', async (req, res)=>{

    const {id} = req.params; 
    const todos = await Todo.findById(id);

    res.render('edit', {todos}); 
})

app.put('/todo/:id/update', async (req, res) => {

    const {title, description} = req.body; 
    
    const todos = await Todo.findByIdAndUpdate(req.params.id, {title, description} ); 
    
    res.redirect('/todo'); 
    
});


app.get('/seeds', async (req, res) => {
    await Todo.deleteMany({});  // Clear existing todos
    await Todo.insertMany(seeds); // Insert the seed data
    res.send('Database seeded with to-do items!');
});


 

app.listen(3000, ()=>{
    console.log("Serving on Port 3000"); 
})