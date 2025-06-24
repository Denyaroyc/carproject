import dbService from '../services/dbService';
import DataModel from '../models/DataModel';
import { Request, Response } from 'express';
type DbServiceType = typeof dbService;

export class DataController {
    constructor(private dbService: DbServiceType) {}

    public getAllData = async (req: Request, res: Response) => {
        try {
            const data = await this.dbService.read(DataModel, {});
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching data', error });
        }
    };

    public getDataById = async (req: Request, res: Response) => {
        try {
            const data = await DataModel.findById(req.params.id);
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching data by ID', error });
        }
    };

    public createData = async (req: Request, res: Response) => {
        try {
            const created = await this.dbService.create(DataModel, req.body);
            res.status(201).json(created);
        } catch (error) {
            res.status(500).json({ message: 'Error creating data', error });
        }
    };

    public updateData = async (req: Request, res: Response) => {
        try {
            const updated = await this.dbService.update(DataModel, req.params.id, req.body);
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating data', error });
        }
    };

    public deleteData = async (req: Request, res: Response) => {
        try {
            const deleted = await this.dbService.delete(DataModel, req.params.id);
            if (deleted) {
                res.status(200).json({ message: 'Data deleted' });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting data', error });
        }
    };
}

export default DataController;