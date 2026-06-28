import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LoginUserDto } from '../dto/login_user.dto';
import { RegisterUserDto } from '../dto/register_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '@/common/dtos/api_response.dto';
import { AuthUser } from '../interfaces/auth_user.interface';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: LoginUserDto): Promise<ApiResponse<AuthUser | null>> {
        const user = await this.authService.validateUser(body.email, body.password);
        
        return user ? { success: true, message: 'Login successful', data: user, timestamp: new Date().toISOString() } : { success: false, message: 'Invalid credentials', data: null, timestamp: new Date().toISOString() };
    }

    @Post('register')
    async register(@Body() body: RegisterUserDto): Promise<ApiResponse<AuthUser | null>> {
        const user = await this.authService.createUser(body);
        return { success: true, message: 'User registered successfully', data: user, timestamp: new Date().toISOString() };
    }

    @Patch('update')
    async update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<ApiResponse<AuthUser | null>> {
        const user = await this.authService.updateUser(id, body);
        return user ? { success: true, message: 'User updated successfully', data: user, timestamp: new Date().toISOString() } : { success: false, message: 'User not found', data: null, timestamp: new Date().toISOString() };
    }

    @Get('user/:id')
    async getUser(@Param('id') id: string): Promise<ApiResponse<AuthUser | null>> {
        const user = await this.authService.getUserById(id);
        return user ? { success: true, message: 'User found', data: user, timestamp: new Date().toISOString() } : { success: false, message: 'User not found', data: null, timestamp: new Date().toISOString() };
    }
}
