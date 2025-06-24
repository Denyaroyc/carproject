class DbService {
    private mongoose: any;
    private connection: any;

    constructor() {
        this.mongoose = require('mongoose');
        this.connection = null;
    }

    async connect(uri: string) {
        if (this.connection) {
            return this.connection;
        }
        try {
            this.connection = await this.mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Database connected successfully');
            return this.connection;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    async create(model: any, data: any) {
        const newData = new model(data);
        return await newData.save();
    }

    async read(model: any, query: any) {
        return await model.find(query);
    }

    async update(model: any, id: string, data: any) {
        return await model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(model: any, id: string) {
        return await model.findByIdAndDelete(id);
    }
}

export default new DbService();