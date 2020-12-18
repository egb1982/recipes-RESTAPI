const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://egb1982:egb1982@cluster0.xj6hy.mongodb.net/cookingBook?retryWrites=true&w=majority",
    {useNewUrlParser: true , useUnifiedTopology: true})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));