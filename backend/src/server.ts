import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import user from './model/user'
import restaurant from './model/restaurant';
import reservation from './model/reservation';
import { ObjectId } from 'mongodb';
import food from './model/food';
import order from './model/order';


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
  const { _id, status, reason, tableId } = req.body;

  try {
    let myReservation = await reservation.findById(_id);

    if (!myReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update reservation fields based on request
    myReservation.status = status;
    if (status === 'declined') {
      myReservation.reason = reason;
    } else {
      myReservation.tableId = tableId;
    }

    // Save updated reservation
    await myReservation.save();

    res.json({ message: 'Reservation updated successfully', reservation: myReservation });
  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/get-reservation', async (req, res) => {
  const { reservationId } = req.body;

  try {
    // Find reservations matching the restaurantName and pending status
    const myReservation = await reservation.findOne({_id : new ObjectId(reservationId)});

    // Return the found reservations as JSON response
    res.json(myReservation);
  } catch (err) {
    // Handle any errors
    console.error('Error retrieving reservations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/get-table-status', async (req, res) => {
  try {
      const { tableId, startTime } = req.body;

      const startDateTime = new Date(startTime);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 3);

      // Find overlapping reservations
      const overlappingReservations = await reservation.find({
          tableId: new ObjectId(tableId),
          date: startDateTime.toISOString().split('T')[0],
          time: {
            $gte: startDateTime.toLocaleString('en-US', {hour12: false}).split(', ')[1].slice(0,5),
            $lt: endDateTime.toLocaleString('en-US', {hour12: false}).split(', ')[1].slice(0,5)
          },
          status: { $in: ['accepted', 'used'] }
      });

      if (overlappingReservations.length > 0) {
          return res.status(200).json({ status: 'unavailable', reservations: overlappingReservations });
      }

      res.status(200).json({ status: 'available' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reservations-by-user', async (req, res) => {
  const { username } = req.body;

  try {
      const reservations = await reservation.find({ username });
      res.json(reservations);
  } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.post('/get-current-reservations', async (req, res) => {
  const { restaurantName } = req.body;

  try {
    // Get the current time and 30 minutes before
    const currentTime = new Date();
    const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60000); // 30 minutes in milliseconds

    // Find reservations matching the restaurantName, status 'accepted', and time within the range
    const reservations = await reservation.find({
      restaurantName,
      status:  { $in: ['accepted', 'used', 'not used'] },
      date: { $eq: currentTime.toISOString().split('T')[0] },
      time: { $gte: thirtyMinutesAgo.toLocaleString('en-US', {hour12: false}).split(', ')[1].slice(0,5),
             $lte: currentTime.toLocaleString('en-US', {hour12: false}).split(', ')[1].slice(0,5) }
    });

    // Return the found reservations as JSON response
    res.json(reservations);
  } catch (err) {
    // Handle any errors
    console.error('Error retrieving reservations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/reservations-last-7-days', async (req, res) => {
  try {
    // Calculate the date 7 days ago from today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Query to count reservations within the last 7 days
    const countReservations = await reservation.countDocuments({
        date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }, // Date should be greater than or equal to 7 days ago
        status: { $in: ['accepted', 'used'] } // Only count 'accepted' or 'used' reservations
    });

    res.json({ count: countReservations });
} catch (err) {
    console.error('Error counting reservations:', err);
    res.status(500).json({ error: 'Server error' });
}
});

router.get('/reservations-last-1-days', async (req, res) => {
  try {
    // Calculate the date 7 days ago from today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);

    // Query to count reservations within the last 1 days
    const countReservations = await reservation.countDocuments({
        date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }, // Date should be greater than or equal to 7 days ago
        status: { $in: ['accepted', 'used'] } // Only count 'accepted' or 'used' reservations
    });

    res.json({ count: countReservations });
} catch (err) {
    console.error('Error counting reservations:', err);
    res.status(500).json({ error: 'Server error' });
}
});

router.get('/reservations-last-30-days', async (req, res) => {
  try {
    // Calculate the date 30 days ago from today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

    // Query to count reservations within the last 1 days
    const countReservations = await reservation.countDocuments({
        date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }, // Date should be greater than or equal to 7 days ago
        status: { $in: ['accepted', 'used'] } // Only count 'accepted' or 'used' reservations
    });

    res.json({ count: countReservations });
} catch (err) {
    console.error('Error counting reservations:', err);
    res.status(500).json({ error: 'Server error' });
}
});

router.post('/foods', async (req, res) => {
  const { restaurantName } = req.body;

  try {
    // Find all foods that belong to the specified restaurantName
    const foods = await food.find({ restaurantName });

    // Return the found foods as JSON response
    res.json(foods);
  } catch (err) {
    // Handle any errors
    console.error('Error retrieving foods:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/place-order', async (req, res) => {
  const { username, restaurantName, foods } = req.body;

  try {
    // Create a new order
    const newOrder = await order.create({ username, restaurantName, foods });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

router.get('/orders/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find orders matching the username
    const orders = await order.find({ username }).populate('foods.food');

    res.json(orders);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/orders-by-restaurant', async (req, res) => {
  const { restaurantName } = req.body;

  try {
    // Find orders matching restaurantName and status 'pending'
    const orders = await order.find({ restaurantName, status: 'pending' }).populate('foods.food').exec();

    // Return the found orders as JSON response
    res.json(orders);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/update-order', async (req, res) => {
  const { _id, status, deliveryTime } = req.body;

  try {
    const updatedOrder = await order.findByIdAndUpdate(_id, { status, deliveryTime }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/total-guests-by-waiter', async (req, res) => {
  const { waiterUsername } = req.body;

  try {
    // Calculate the date range for the last 10 days
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);

    // Format dates to match the string format in the reservation model
    const formattedToday = today.toISOString().split('T')[0];
    const formattedTenDaysAgo = tenDaysAgo.toISOString().split('T')[0];

    // Find reservations for the waiterUsername and date range
    const reservations = await reservation.aggregate([
      {
        $match: {
          waiterUsername,
          date: { $gte: formattedTenDaysAgo, $lte: formattedToday },
          status: 'used'
        }
      },
      {
        $group: {
          _id: "$date",
          totalGuests: { $sum: "$guests" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Return the aggregated results as JSON response
    res.json(reservations);
  } catch (err) {
    console.error('Error calculating total guests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/waiter-guests', async (req, res) => {
  const { restaurantName } = req.body;

  try {
    // Aggregate reservations to calculate total guests per waiter
    const waiterGuests = await reservation.aggregate([
      {
        $match: { restaurantName, status: 'used' }
      },
      {
        $group: {
          _id: "$waiterUsername",
          totalGuests: { $sum: "$guests" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(waiterGuests);
  } catch (err) {
    console.error('Error calculating waiter guests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/average-reservations-per-day', async (req, res) => {
  const { restaurantName } = req.body;

  try {
    const averageReservationsPerDay = await reservation.aggregate([
      {
        $match: {
          restaurantName, // Match reservations for the given restaurantName
          status: 'used' // Filter to include only reservations with status 'used'
        }
      },
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: { $dateFromString: { dateString: "$date" } } } // Extract day of the week (1-7, where 1 is Sunday)
        }
      },
      {
        $group: {
          _id: "$dayOfWeek", // Group by day of the week
          count: { $sum: 1 } // Count the number of reservations per day of the week
        }
      },
      {
        $group: {
          _id: "$dayOfWeek", // Group all results together
          averageReservations: { $avg: "$count" } // Calculate average of counts
        }
      }
    ]);

    if (averageReservationsPerDay.length > 0) {
      res.json({ averageReservationsPerDay: averageReservationsPerDay });
    } else {
      res.json({ averageReservationsPerDay: 0 }); // Return 0 if no reservations found
    }
  } catch (err) {
    console.error('Error calculating average reservations per day:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
//-----------------------------------------------------------------


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`))