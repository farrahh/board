var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var mongoose = require('mongoose');

var path= require('path');
mongoose.Promise = global.Promise;
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
var connection = mongoose.connect('mongodb://localhost/message_board2');
var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
  name:{type:String, required: true, minLength:1},
 message: {type: String, required: true },
 comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true });


var CommentSchema = new mongoose.Schema({
  name:{type:String, required: true, minLength:1},
 _post: {type: Schema.Types.ObjectId, ref: 'Post'},
 text: {type: String, required: true }
}, {timestamp: true });

mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);
var Post = mongoose.model('Post', PostSchema);
var Comment = mongoose.model('Comment', CommentSchema);


app.get("/", function(req, res){
  Post.find({},false, true).populate('comments').exec(function(err,results){
    console.log(results);
    if(err) { console.log(err);
    }
    else{
      res.render('index', {post:results});
    }
  })
});

app.post('/message', function(req, res){
  console.log(req.body);
  var post=new Post({name:req.body.name,message:req.body.message});
    post.save(function(err){
      if(err) {
        console.log(err);
        res.redirect('/');
      }
      else{
        res.redirect('/');
      }
    });
});
app.post('/message/:id', function (req, res){
  Post.findOne({_id: req.params.id}, function(err, post){
         var comment = new Comment({name:req.body.name, text:req.body.text});
         console.log(comment, "comment is being hit!");
         comment._post = post._id;
  Post.update({_id:post._id}, {$push:{"_comments" : comment}}, function (err){

});
        comment._post = post._id;

         comment.save(function(err){
              post.comments.push(comment);
                 post.save(function(err){
                       if(err) { console.log('Error'); }
                       else { res.redirect('/'); }
                 });
         });
   });
 });


app.listen(8000, function() {
    console.log("listening on port 8000");
})
mongoose.Promise = global.Promise;
