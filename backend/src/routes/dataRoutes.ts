import { Router } from 'express';
import { DataController } from '../controllers/dataController';
import dbService from '../services/dbService';

const dataController = new DataController(dbService);

export const setRoutes = (app: any) => {
    const router = Router();
    router.get('/', dataController.getAllData);
    router.get('/:id', dataController.getDataById);
    router.post('/', dataController.createData);
    router.put('/:id', dataController.updateData);
    router.delete('/:id', dataController.deleteData);
    app.use('/api/data', router);
};