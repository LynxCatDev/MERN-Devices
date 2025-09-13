import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AuthUserDto {
  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'my-password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 32, { message: 'Password must be between 6 and 32 characters' })
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1
  // })
  readonly password: string;

  @ApiProperty({
    example: 'Theodore',
  })
  readonly first_name?: string;

  @ApiProperty({
    example: 'Lightman',
  })
  readonly last_name?: string;
}
