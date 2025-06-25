import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Car } from './models/Car';
import { SearchQuery } from './types/QueryParams';
import DataModel from './models/DataModel';
import cors from 'cors';
import qs from 'qs';
import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';


const app = express();
const PORT = 5000;

app.use(cors()); // ✅ Enables CORS for all origins

app.set('query parser', (str: string) => qs.parse(str));

// OR more securely:
app.use(cors({
  origin: 'http://localhost:8080', // 🔒 restrict to just your frontend origin
}));

app.use(bodyParser.json());

async function replaceCarsFromCSV() {
    const csvFilePath = path.join(__dirname, '../../Test_Data_ElectricCarData.csv'); // Adjust path if needed
    if (!fs.existsSync(csvFilePath)) {
        console.error('CSV file not found:', csvFilePath);
        return;
    }
    const jsonArray = await csv().fromFile(csvFilePath);

    // Remove all existing documents
    await Car.deleteMany({});
    // Insert new documents
    await Car.insertMany(jsonArray);
    console.log('MongoDB collection replaced with CSV data.');
}

mongoose.connect('mongodb+srv://denyaroy7:denyageo@cluster0.ttu3fdd.mongodb.net/mongodbVSCodePlaygroundDB?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as mongoose.ConnectOptions)
    .then(async () => {
        console.log('MongoDB connected');
        //await replaceCarsFromCSV(); // <-- Add this line
    })    .catch(err => console.error('MongoDB connection error:', err));


app.get('/api/cars', async (req: Request, res: Response) => {
    try {
        console.log('Received request with query:', req.query);
        const { search, filters = [] } = req.query as {
            search?: string;
            filters: Array<{ column: string; type: string; value: string }>;
        };

        const query: Record<string, any> = {};
        // List of numeric fields
        const numericFields = ['Range_Km', 'TopSpeed_KmH', 'AccelSec', 'Efficiency_WhKm', 'Seats', 'PriceEuro'];

        // Build query from filters
        filters.forEach(filter => {
            const { column, type, value } = filter;
            if (!column || !type) return;

            const numVal = Number(value);
            const isNumericField = numericFields.includes(column);

            switch (type) {
                case 'startsWith':
                    if (!isNumericField) {
                        query[column] = { $regex: `^${value}`, $options: 'i' };
                    }
                    break;
                case 'endsWith':
                    if (!isNumericField) {
                        query[column] = { $regex: `${value}$`, $options: 'i' };
                    }
                    break;
                case 'contains':
                    if (!isNumericField) {
                        query[column] = { $regex: value, $options: 'i' };
                    }
                    break;
                case 'equals':
                    query[column] = isNumericField ? numVal : value;
                    break;
                case 'greaterThan':
                    if (isNumericField) query[column] = { $gt: numVal };
                    break;
                case 'lessThan':
                    if (isNumericField) query[column] = { $lt: numVal };
                    break;
            }
        });

        // Optional search string
        if (search) {
            query.$or = [
                { Brand: { $regex: search, $options: 'i' } },
                { Model: { $regex: search, $options: 'i' } },
                { PowerTrain: { $regex: search, $options: 'i' } },
                { PlugType: { $regex: search, $options: 'i' } },
                { BodyStyle: { $regex: search, $options: 'i' } },
            ];
        }

        const results = await Car.find(query);
        res.json(results);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/car', async (req: Request, res: Response) => {
    try {
        console.log('Fetching car with ID:', req.query.id);
        // Use the correct model for your collection (Car or DataModel)
        const car = await Car.findById(req.query.id); // or DataModel.findById(req.params.id)
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        console.log('Car found:', car);
        const obj = car.toObject ? car.toObject() : car;
        res.json({
            ...obj,
            id: obj._id?.toString(),
            RapidCharge: obj.RapidCharge ? "Yes" : "No"
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/car', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Car.findByIdAndDelete(req.query.id as string); // or DataModel.findByIdAndDelete(req.query.id as string)
        if (!result) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        res.json({ message: 'Car deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(` Server is running at http://localhost:${PORT}`);
});
