import { RegisterUserDto } from "./register_user.dto";
import { PartialType } from '@nestjs/mapped-types';


export class UpdateUserDto extends PartialType(RegisterUserDto) {}

