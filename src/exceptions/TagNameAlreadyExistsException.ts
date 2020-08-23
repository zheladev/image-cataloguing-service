import HttpException from "./HttpException";

class TagNameAlreadyExistsException extends HttpException {
    name: string;
    constructor(name: string) {
        super(400, `${name} tag is already in use.`);
        this.name = name;
    }
}

export default TagNameAlreadyExistsException;

