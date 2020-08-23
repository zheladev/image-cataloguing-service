import HttpException from "./HttpException";

class ResourceNotFoundException extends HttpException {
    resourceId: string;
    resourceType: string;
    constructor(resourceId: string, resourceType: string) {
        super(404, `${resourceType} with id ${resourceId} not found`);
        this.resourceId = resourceId;
        this.resourceType = resourceType;
    }
}

export default ResourceNotFoundException;

