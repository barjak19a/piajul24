import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import user from './model/user'


const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/jul2024')
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('db connection ok')
});

const router = express.Router();

//-----------------------------------------------------------------
router.route('/login').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let data = {
        username: username,
        password: password
    };

    console.log('\n\n/login');
    console.log(data);

    user.findOne(data).then((user) => {
        console.log(user);
        res.json(user);
    }).catch((err) => console.log(err));
    
});

router.route('/register').post((req, res) => {
    const { username, password, firstName, lastName, gender, safetyQuestion, safetyAnswer, address, phoneNumber, email, creditCard } = req.body;

    const newUser = new user({
        username,
        password,
        firstName,
        lastName,
        gender,
        safetyQuestion,
        safetyAnswer,
        address,
        phoneNumber,
        email,
        creditCard
    });

    newUser.save()
        .then(user => {
            console.log('New user created:', user);
            res.json(user);
        })
        .catch(err => {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Failed to register user. Please try again.' });
        });
});

//-----------------------------------------------------------------


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`))