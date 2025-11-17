import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserRole, UserStatus } from '../entities/User';
import { AuthRequest } from '../middlewares/auth';

const userService = new UserService();

export class UserController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, dateOfBirth, email, password, role } = req.body;

            if (!fullName || !dateOfBirth || !email || !password) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            const { user, token } = await userService.registerUser(
                fullName,
                new Date(dateOfBirth),
                email,
                password,
                role || UserRole.USER
            );

            res.status(201).json({
                message: 'User registered successfully',
                user,
                token,
            });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({
                    error: 'Email and password are required',
                });
                return;
            }

            const { user, token } = await userService.loginUser(
                email,
                password
            );

            res.json({
                message: 'Login successful',
                user,
                token,
            });
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    }

    async getUserById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const currentUser = req.user!;

            if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            const user = await userService.getUserById(id);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.json({ users });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const currentUser = req.user!;

            if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            if (!Object.values(UserStatus).includes(status)) {
                res.status(400).json({ error: 'Invalid status' });
                return;
            }

            const updatedUser = await userService.updateUserStatus(id, status);

            if (!updatedUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({
                message: 'User status updated successfully',
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
