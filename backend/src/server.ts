import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import user from './model/user'
import restaurant from './model/restaurant';
import reservation from './model/reservation';


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

    if (newUser.role == "waiter") {
      newUser.status = "approved";
    }

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

router.get('/restaurants-count', async (req, res) => {
    try {
      const count = await restaurant.countDocuments();
      res.json({ count });
    } catch (err) {
      console.error('Error fetching restaurant count:', err);
      res.status(500).json({ error: 'Failed to fetch restaurant count.' });
    }
  });

router.get('/guest-users-count', async (req, res) => {
    try {
      const count = await user.countDocuments({ role: 'guest' });
      res.json({ count });
    } catch (error) {
      console.error('Error fetching guest users count:', error);
      res.status(500).json({ error: 'Failed to fetch guest users count' });
    }
  });

router.route('/get-all-restaurants').get((req, res) => {
    restaurant.find()
        .then(restaurants => res.json(restaurants))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update-profile', async (req, res) => {
  const { id, username, firstName, lastName, gender, address, phoneNumber, email, creditCard, profilePicture } = req.body;

  try {
    const updatedUser = await user.findOneAndUpdate(
      { username },
      {
        firstName,
        lastName,
        gender,
        address,
        phoneNumber,
        email,
        creditCard,
        profilePicture
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
});
  router.post('/guest-users', (req, res) => {
    const { approved } = req.body;
    user.find({ role: 'guest', status: 'pending' })
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.put('/users/approve/:username', async (req, res) => {
  const username = req.params.username;

  try {
      const myUser = await user.findOneAndUpdate({ username }, { status: 'approved' }, { new: true });
      if (!myUser) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json(myUser);
  } catch (err) {
      console.error('Error approving user:', err);
      res.status(500).json({ error: 'Failed to approve user' });
  }
});

router.put('/users/deny/:username', async (req, res) => {
  const username = req.params.username;

  try {
      const myuser = await user.findOneAndUpdate({ username }, { status: 'denied' }, { new: true });
      if (!myuser) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json(myuser);
  } catch (err) {
      console.error('Error denying user:', err);
      res.status(500).json({ error: 'Failed to deny user' });
  }
});

router.post('/users/check-existence', async (req, res) => {
  const { username, email } = req.body;

  try {
    const myuser = await user.findOne({
      $or: [{ username }, { email }]
    });

    if (myuser) {
      return res.json(myuser);
    }

    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error('Error checking user existence:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', async (req, res) => {
  const { role, status } = req.query;

  try {
    const myUsers = await user.find({ role: role, status: status });
    res.json(myUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const myUser = await user.findOne({ username });
    if (!myUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(myUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-restaurant', async (req, res) => {
  try {
    const newRestaurant = new restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/get-restaurant-by-name', async (req, res) => {
  const { restaurantName } = req.body;
  try {
    const my_restaurant = await restaurant.findOne({ name: restaurantName });
    if (my_restaurant) {
      res.json(my_restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/make-reservation', async (req, res) => {
  const { date, time, description, guests, restaurantName, username } = req.body;
  const myReservation = new reservation({ date, time, description, guests, restaurantName, username });
  try {
      await myReservation.save();
      res.status(201).send({ message: 'Reservation created successfully' });
  } catch (error) {
      res.status(500).send({ message: 'Failed to create reservation', error });
  }
});

router.post('/get-reservations', async (req, res) => {
  const { restaurantName } = req.body;

  try {
    // Find reservations matching the restaurantName and pending status
    const reservations = await reservation.find({ restaurantName, status: 'pending' });

    // Return the found reservations as JSON response
    res.json(reservations);
  } catch (err) {
    // Handle any errors
    console.error('Error retrieving reservations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/update-reservation', async (req, res) => {
  const { _id, status, reason } = req.body;

  try {
    let myReservation = await reservation.findById(_id);

    if (!myReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update reservation fields based on request
    myReservation.status = status;
    if (status === 'declined') {
      myReservation.reason = reason;
    }

    // Save updated reservation
    await myReservation.save();

    res.json({ message: 'Reservation updated successfully', reservation: myReservation });
  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
//-----------------------------------------------------------------


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`))