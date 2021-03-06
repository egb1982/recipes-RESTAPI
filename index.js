if (process.env.NODE_ENV === 'development'){
    require('dotenv').config();    
}

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Initializations
const app = express();
require('./database');

// Settings
app.set('port',process.env.PORT||8080);

//Middlewares
app.use(morgan('dev'));
app.use(cors());
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename(req, file, callback){
        callback(null,new Date().getTime() + path.extname(file.originalname));
    }
})

app.use(multer({storage}).single('image'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Routes
app.use('/api/recipes', require('./routes/recipes'));

/// Static FIles
app.use(express.static(path.join(__dirname,'public')));

// Start the server
app.listen(app.get('port'),() => {
    console.log('Server on port', app.get('port'));
})