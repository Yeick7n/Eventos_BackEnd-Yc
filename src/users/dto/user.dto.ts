import {
  IsNotEmpty,
  Length,
  IsString,
  Matches,
  IsEmail,
  IsArray,
  IsOptional,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContratoDto } from './contrato.dto';

export class UserDto {
  @ApiProperty()
  @Matches(/^(?!\s*$).+/, { message: 'El documento no puede ser estar vacío' })
  readonly documento: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  readonly nombre: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El apellido no puede ser estar vacío' })
  readonly apellido: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El correo no puede ser estar vacío' })
  readonly correo: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El celular no puede ser estar vacío' })
  readonly celular: string;

  @ApiProperty()
  @IsOptional()
  readonly contrato?: ContratoDto;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly programas: string[];

  @ApiProperty()
  @Matches(/^(?!\s*$).+/, { message: 'El centro no puede estar vacía' })
  readonly centro: string;

  @IsString()
  @ApiProperty()
  @Length(6, 50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener Mayusculas, minusculas y numeros',
  })
  readonly password: string;

  @IsArray()
  @ApiProperty()
  @ArrayNotEmpty({ each: false })
  readonly roles: string[];
}

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El correo no puede ser estar vacío' })
  readonly correo: string;

  @IsString()
  @ApiProperty()
  @Length(6, 50)
  // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'La contraseña debe contener Mayusculas, minusculas y numeros',
  // })
  readonly password: string;
}

export class ActualizarUserDto {

  @ApiProperty({
    type: String,
    description: 'El ObjectId del usuario',
    default: '12345678',
  })
  
  @IsMongoId()
  // @IsOptional()
  // @Matches(/^(?!\s*$).+/, { message: 'El Id no puede ser estar vacío' })
  readonly id: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/^(?!\s*$).+/, { message: 'El documento no puede ser estar vacío' })
  readonly documento: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  readonly nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El apellido no puede ser estar vacío' })
  readonly apellido: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El correo no puede ser estar vacío' })
  readonly correo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El celular no puede ser estar vacío' })
  readonly celular: string;

  @ApiProperty()
  @IsOptional()
  readonly contrato?: ContratoDto;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly programas: string[];

  @ApiProperty()
  @Matches(/^(?!\s*$).+/, { message: 'El centro no puede estar vacía' })
  readonly centro: string;

  @IsArray()
  @ApiProperty()
  @IsOptional()
  @ArrayNotEmpty({ each: false })
  readonly roles: string[];
}