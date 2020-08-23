import { isArray, IsArray, IsOptional, IsString } from 'class-validator';
import Tag from '../models/tag.model';

class CreateImageDto {
    @IsString()
    public name: string;

    @IsOptional()
    public tags?: Array<number>

    @IsOptional()
    public newTags?: Array<string>
}

export default CreateImageDto;