const express = require("express");
const { EnviromentVariables } = require('./config/EnvironmentVariables');
const { DBCONNECTION } = require('./config/dataBase');
const { errorHandler } = require('./middleware/Error/ErrorHandler');
const passport = require('passport');
const session = require('express-session');
const userRouter = require('./router/userRouter');
const cors = require('cors');
require('./auth');

const port = EnviromentVariables.PORT || 5000;
const app = express();

// Connect to database
DBCONNECTION();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'https://your-production-frontend-url.com'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: EnviromentVariables.SESSION_SECRET || "my secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: "You are now connected to the server"
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/success', (req, res) => {
  res.redirect('http://localhost:3000/onboarding2');
});

app.get('/auth/google/failure', (req, res) => {
  res.status(400).json({
    message: "Failed to continue with Google"
  });
});

app.use('/api/user', userRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error("Error starting server:", error);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.log("Server is shutting down due to uncaught exception", error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log("Server is shutting down due to unhandled rejection", reason);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app; // For testing purposes