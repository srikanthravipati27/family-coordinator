const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const serviceAccount = require('./ravi.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));


app.get('/', async (req, res) => {
    res.render('index'); 
});


app.get('/signup', async (req, res) => {
    res.render('signup'); 
});


app.get('/login', async (req, res) => {
    res.render('login'); 
});
app.get('/calendar', async (req, res) => {
    res.render('calender'); 
});
app.get('/todo', async (req, res) => {
    res.render('todo'); 
});
app.get('/groupchat', async (req, res) => {
    res.render('groupchat'); 
});
app.get('/groupchat', async (req, res) => {
    res.render('groupchat'); 
});
app.get('/profile', async (req, res) => {
    res.render('profile');
});

// User registration API
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Store user details in Firestore
    await db.collection('users').add({ email, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// User login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
        return res.render('login', { message: 'Invalid email or password' }); // Display login page with error
    }

    const user = userSnapshot.docs[0].data();
    if (user.password !== password) {
        return res.render('login', { message: 'Invalid email or password' }); // Display login page with error
    }

    // Redirect to the index page after successful login
    res.redirect('/index');
});

// API routes for events
app.post('/api/events', async (req, res) => {
    const { title } = req.body;
    await db.collection('events').add({ title });
    res.sendStatus(201);
});

app.get('/api/events', async (req, res) => {
    const eventsSnapshot = await db.collection('events').get();
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(events);
});


// API routes for chat
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    await db.collection('chat').add({ message });
    res.sendStatus(201);
});

app.get('/api/chat', async (req, res) => {
    const chatSnapshot = await db.collection('chat').get();
    const messages = chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
