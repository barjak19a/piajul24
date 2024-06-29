import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
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
    const { username, password } = req.body;
    
    user.findOne({ username }).then(user => {
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password || '', (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid username or password' });
            }

            res.json(user);
        });
    }).catch(err => {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Failed to log in. Please try again.' });
    });
});


router.route('/adminlogin').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let data = {
        username: username,
        password: password
    };

    user.findOne(data).then((user) => {
        res.json(user);
    }).catch((err) => console.log(err));

});

router.route('/register').post((req, res) => {
    const { username, password, firstName, lastName, gender, safetyQuestion, safetyAnswer, address, phoneNumber, email, creditCard, profilePicture, role } = req.body;

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
        creditCard,
        profilePicture,
        role
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

router.post('/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
  
    try {
      const myUser = await user.findOne({username});
      if (!myUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if current password matches
      const isPasswordValid = await bcrypt.compare(currentPassword, myUser.password || '');
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }
  
      // Hash the new password and save
      myUser.password = newPassword;
      await myUser.save();
  
      res.json({ message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password. Please try again.' });
    }
  });
//-----------------------------------------------------------------


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`))