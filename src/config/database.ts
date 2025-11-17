import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_PATH || './database.sqlite',
    entities: [User],
    synchronize: true,
    logging: false,
});
