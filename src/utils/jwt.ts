import jwt, { SignCallback } from 'jsonwebtoken';
import { User } from '../entities/User';

export const generateToken = (user: User): string => {
    return jwt.sign({ userId: user.id }, `${process.env.JWT_SECRET}`, {
        expiresIn: `7d`,
    });
};
