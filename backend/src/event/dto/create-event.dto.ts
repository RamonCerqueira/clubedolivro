import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;

  @IsEnum(['ONLINE', 'PRESENTIAL'])
  type: 'ONLINE' | 'PRESENTIAL';

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  participantLimit?: number;
}
