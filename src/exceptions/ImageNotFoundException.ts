import ResourceNotFoundException from "./ResourceNotFoundException";

class ImageNotFoundException extends ResourceNotFoundException {
    id: string;
    constructor(id: string) {
        super(id, 'Image');
    }
}

export default ImageNotFoundException;