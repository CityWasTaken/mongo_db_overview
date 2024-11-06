import express from 'express';
import connection from './config/connection.js';
import User from './models/User.js';
const app = express();
const PORT = process.env.PORT || 3333;
// Middleware
// This allows json to be attatched to req.body in out user routes
app.use(express.json());
// create a POST route that creates a user in the collection user your user model and sends back the user object as a json response
app.post('/api/users', async (req, res) => {
    try {
        // If req.body is the user's information(email, password) how do i use the model to create the user with req.body?
        const user = await User.create(req.body);
        res.json({
            user: user
        });
    }
    catch (error) {
        const errors = [];
        console.log(error.message);
        if (error.code === 11000) {
            errors.push('That email is already in use');
        }
        else {
            for (const prop in error.errors) {
                errors.push(error.errors[prop].message);
            }
        }
        res.status(403).json({
            error: errors
        });
    }
});
// Create a GET route that send back ALL users from the collection
app.get('/api/users', async (_, res) => {
    const users = await User.find();
    res.json({
        users: users
    });
});
connection.once('open', () => {
    app.listen(PORT, () => {
        console.log('Express server has started on', PORT);
    });
});
