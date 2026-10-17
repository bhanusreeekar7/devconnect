import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/users.repositories.js';
import { RegisterDTO, LoginDTO, SafeUser, AuthTokens } from '../types/auth.types.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../middlewares/errors.js';



export class AuthService {
    private generateTokens(userId: string): AuthTokens {
        const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };

    }
    private toSafeUser(user: any): SafeUser {
        const { password_hash, ...safeUser } = user;
        return safeUser as SafeUser;
    }
    async register(dto: RegisterDTO): Promise<{ user: SafeUser, tokens: AuthTokens }> {
        const existingMail = await userRepository.findByEmail(dto.email);
        if (existingMail) {
            throw new ConflictError("An account with this emaill already exists");

        }
        const existingUserName = await userRepository.findByUsername(dto.username);
        if (existingUserName) {
            throw new ConflictError("An account with this username already exists");

        }
        const password_hash = await bcrypt.hash(dto.password, 12);
        const newUser = await userRepository.create(dto.username, dto.email, password_hash);
        const tokens = this.generateTokens(newUser.id);
        return { user: this.toSafeUser(newUser), tokens };

    }
    async login(dto: LoginDTO): Promise<{ user: SafeUser; tokens: AuthTokens }> {
        const user = await userRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedError('Invalid email or password.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password.');
        }
        const tokens = this.generateTokens(user.id);
        return {
            user: this.toSafeUser(user),
            tokens,
        };

    }
    async refresh(token: string): Promise<AuthTokens> {
        let payload: { userId: string };
        try {
            payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
        }
        catch {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }
        const user = await userRepository.findById(payload.userId);
        if (!user) { throw new UnauthorizedError('User not found'); }
        return this.generateTokens(user.id);
    }
    async getMe(userId: string): Promise<SafeUser> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found.');
        }
        return this.toSafeUser(user);
    }
}
export const authService = new AuthService();
