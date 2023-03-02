import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @IsLatitude()
  @IsNotEmpty()
  lat: number;
}
