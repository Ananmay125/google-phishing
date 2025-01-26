const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/v3/signin/login.html');
});

app.get('/v3/signin/login', (req, res) => {
    res.sendFile(__dirname + '/v3/signin/login.html');
});

app.get('/v3/signin/register', (req, res) => {
    res.sendFile(__dirname + '/v3/signin/register.html');
});

// MongoDB Atlas connection
mongoose
  .connect('mongodb+srv://ananmay125:ef3gyGzLisRUJ6rY@phish.grv1k.mongodb.net/?retryWrites=true&w=majority&appName=phish', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Routes
// Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.send('Username already exists.');
    }

    const user = new User({ username, password }); // Password stored as plain text
    await user.save();

    res.send('User registered successfully!');
  } catch (error) {
    res.status(500).send('Error registering user: ' + error.message);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid credentials.');
    }
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
});

// Start the server
app.listen(port, () => console.log('Server running on http://localhost:3000'));
