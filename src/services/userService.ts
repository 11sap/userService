import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async registerUser(
        fullName: string,
        dateOfBirth: Date,
        email: string,
        password: string,
        role: UserRole = UserRole.USER
    ): Promise<{ user: User; token: string }> {
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await hashPassword(password);

        const user = this.userRepository.create({
            fullName,
            dateOfBirth,
            email,
            password: hashedPassword,
            role,
            status: UserStatus.ACTIVE,
        });

        await this.userRepository.save(user);

        const token = generateToken(user);

        return { user, token };
    }

    async loginUser(
        email: string,
        password: string
    ): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new Error('User account is inactive');
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken(user);

        return { user, token };
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
        });
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async updateUserStatus(
        id: string,
        status: UserStatus
    ): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) return null;

        user.status = status;
        await this.userRepository.save(user);

        return user;
    }
}
