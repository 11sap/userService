import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { userRoutes } from './routes/userRoutes';
import { setupSwagger } from './config/swagger';

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use('/api', userRoutes);

app.use((
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const initializeApp = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('DB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

initializeApp();
