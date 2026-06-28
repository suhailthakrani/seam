import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {

  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

    @MinLength(8)
  password!: string;

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone?: string;
}