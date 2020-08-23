import { IsString } from 'class-validator';

class CreateImageDto {
    @IsString()
    public name: string;
}

export default CreateImageDto;