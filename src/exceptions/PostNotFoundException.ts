import ResourceNotFoundException from "./ResourceNotFoundException";

class PostNotFoundException extends ResourceNotFoundException {
    id: string;
    constructor(id: string) {
        super(id, 'Post');
    }
}

export default PostNotFoundException;