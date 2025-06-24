import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { setRoutes } from './routes/dataRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect('mongodb+srv://Wreni:denwreni@cluster0.hoohjtj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Set up routes
setRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(express.json()); // Parse JSON bodies

// Sample route: GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});


// Define Mongoose schema
const carSchema = new mongoose.Schema({}, { strict: false });
const Car = mongoose.model('Car', carSchema, 'cars');

// GET /api/cars?search=Tesla&filter[PowerTrain]=AWD&filter[TopSpeed_KmH]=250
app.get('/api/cars', async (req, res) => {
  try {
    const { search, filter = {} } = req.query as {
      search?: string;
      filter?: Record<string, string>;
    };

    // Prepare MongoDB query
    const query: Record<string, any> = {};

    // Add search across multiple fields
    if (search) {
      query.$or = [
        { Brand: { $regex: search, $options: 'i' } },
        { Model: { $regex: search, $options: 'i' } },
        { PowerTrain: { $regex: search, $options: 'i' } },
        { PlugType: { $regex: search, $options: 'i' } },
        { BodyStyle: { $regex: search, $options: 'i' } },
      ];
    }

    // Add filters
    for (const [key, value] of Object.entries(filter || {})) {
      if (!isNaN(Number(value))) {
        query[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        query[key] = value === 'true';
      } else {
        query[key] = value;
      }
    }

    const results = await Car.find(query);
    res.json(results);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});
