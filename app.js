let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');


//APP CONFIG
 mongoose.connect('mongodb://localhost:27017/restful_blog', {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() =>console.log('Connected to Db!'))
.catch(error => console.log(error.message));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    create: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title:'test blog',
//     image: 'https://images.unsplash.com/photo-1600493504591-aa1849716b36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80',
//     body: 'This is the house we want to move into asap'
// })

//RESTFUL ROUTES

//index
app.get('/', function(req, res){
    res.redirect('/blogs'); //redirects to the blogs page rather than having its own page
});

//index route
app.get('/blogs', function(req, res){
    Blog.find({} , function(err, blogs){ /*empty finds everything*/
        if(err){
            console.log(err);
        } else{
            res.render('index', {blogs: blogs}); //gets index.ejs and sends data that comes back from find called blogs
        }
    });
});

//new rout
app.get('/blogs/new', function(req,res){
     res.render('new');
})

//create route
app.post('/blogs', function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else{
            //redirect to index
            res.redirect('/blogs');
        }
    })
})

app.listen(3000, function(){
    console.log("The server is running yipeee!");
})