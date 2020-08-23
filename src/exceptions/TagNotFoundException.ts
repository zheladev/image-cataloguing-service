import ResourceNotFoundException from "./ResourceNotFoundException";

class TagNotFoundException extends ResourceNotFoundException {
    id: string;
    constructor(id: string) {
        super(id, 'Tag');
    }
}

export default TagNotFoundException;