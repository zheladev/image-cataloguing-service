import { isArray, IsArray, IsBase64, IsOptional, IsString } from 'class-validator';
import Tag from '../models/tag.model';
import CreateTagDto from './tag.dto';

class CreateImageDto {
    @IsString()
    public name: string;

    @IsOptional()
    public tags?: Array<string>

    @IsString()
    public base64data: string;
}

export default CreateImageDto;