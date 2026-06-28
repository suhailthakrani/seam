import { ConflictException, Injectable } from '@nestjs/common';
import { AuthUser } from '../interfaces/auth_user.interface';
import { RegisterUserDto } from '../dto/register_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';

type UserEntity = AuthUser & { password: string };

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService) { }

    private async getUserByEmail(email: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({
            where: { email },
        }) as unknown as UserEntity | null;
    }

    async getUserById(id: string): Promise<AuthUser | null> {
        return this.prisma.user.findUnique({
            where: { id },
        }) as unknown as AuthUser | null;
    }

    async validateUser(email: string, password: string): Promise<AuthUser | null> {
        const user = await this.getUserByEmail(email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return null;

        const { password: _, ...result } = user;
        return result as AuthUser;
    }

    async createUser(userData: RegisterUserDto): Promise<AuthUser> {
        if (await this.getUserByEmail(userData.email)) {
            throw new ConflictException('Email already exists');
        }
        const hashed = await bcrypt.hash(userData.password, 10);

        const id = crypto.randomUUID(); // Generate a new UUID if not provided

        return this.prisma.user.create({
            data: {
                id: id,
                name: userData.name,
                email: userData.email,
                password: hashed,
                phone: userData.phone,
            },
        }) as unknown as AuthUser;
    }

    async updateUser(id: string, updateData: UpdateUserDto): Promise<AuthUser | null> {

        return this.prisma.user.update({
            where: { id },
            data: {
                ...(updateData.name && { name: updateData.name }),
                ...(updateData.email && { email: updateData.email }),
                ...(updateData.phone && { phone: updateData.phone }),
            }

        }) as unknown as AuthUser | null;
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            await this.prisma.user.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }

}
