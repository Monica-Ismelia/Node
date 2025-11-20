import { ApiProperty } from "@nestjs/swagger";

export class CreateFileDto {
    @ApiProperty({
    name: 'file',
    required: true,
    type: 'string',
    description: 'Archivo que será subido al servidor.',
    example: 'image.png',
  })
  file: string;
}
