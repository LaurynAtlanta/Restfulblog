let express = require('express'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();


//APP CONFIG
 mongoose.connect('mongodb://localhost:27017/restful_blog', {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() =>console.log('Connected to Db!'))
.catch(error => console.log(error.message));
mongoose.set("useFindAndModify", false);
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //needs to go after bodyparser
app.use(methodOverride('_method')); //treat as put or delete whatever is specified


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

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
    req.body.blog.body = req.sanitize(req.body.blog.body); //this sanitizes the body input and returns
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else{
            //redirect to index
            res.redirect('/blogs');
        }
    })
})

//show route
app.get('/blogs/:id', function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){ //look for the id that was passed in after blogs
       if(err){
           res.redirect('/blogs'); //just redirect the page for blogs if it doesnt work.
       } else{
           res.render('show', {blog: foundBlog}); //take the blog and send its data to show
       }
   })
})
//edit route

app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){ //look for the id that was passed in after blogs
        if(err){
            res.redirect('/blogs'); 
        } else{
            res.render('edit', {blog: foundBlog}); 
        }
    });
});

//update route
app.put('/blogs/:id', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); //need to sanitize update aswell
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs');
        } else{
            res.redirect('/blogs/'+ req.params.id);
        }
    })
});
//destroy route
app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        } else{
            res.redirect('/blogs');
        }
    })
});


app.listen(3000, function(){
    console.log("The server is running yipeee!");
});