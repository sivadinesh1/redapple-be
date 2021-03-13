const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const db = require('./helpers/db');

// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');

//For https
const https = require('https');

const fs = require('fs');

// app
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.static('public'));
let corsOptions;

if (process.env.NODE_ENV == 'development') {
	corsOptions = {
		origin: `${process.env.CLIENT_URL}`,
		optionsSuccessStatus: 200,
		credentials: true,
	};
} else {
	corsOptions = { origin: '*', optionsSuccessStatus: 200, credentials: true };
}

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);

// routes
// app.use("/api", require("./routes/api/general"));

// app.get('/api', (req, res) => {

//     db.any('SELECT * from users')
//   .then(function (data) {
//     console.log('DATA:', data)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   })

// })

const port = process.env.PORT || 5050;

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});

// START UP CMD
// npm start
