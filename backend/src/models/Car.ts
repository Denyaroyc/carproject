import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({}, { strict: false });

export const Car = mongoose.model('Car', carSchema, 'cars');
