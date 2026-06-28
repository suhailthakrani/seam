import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET || 'supersecret',
    signOptions: { expiresIn: '1d' },
  }), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],

})
export class AuthModule { }
