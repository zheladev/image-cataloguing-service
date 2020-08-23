import { isArray, IsArray, IsOptional, IsString } from 'class-validator';
import Tag from '../models/tag.model';
import CreateTagDto from './tag.dto';

class CreateImageDto {
    @IsString()
    public name: string;

    @IsOptional()
    public tags?: Array<string>
}

export default CreateImageDto;