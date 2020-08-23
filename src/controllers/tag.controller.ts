import Controller from "interfaces/controller.interface";
import * as express from 'express';
import { getRepository } from "typeorm";
import Tag from "../models/tag.model";
import CreateTagDto from "../dtos/tag.dto";
import validationMiddleware from "../middleware/validation.middleware";

class TagController implements Controller {
    public path = '/tags';
    public router = express.Router();
    private tagRepository = getRepository(Tag);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllTags);
        this.router.post(this.path, validationMiddleware(CreateTagDto), this.createTag);
    }

    private getAllTags = async (request: express.Request, response: express.Response) => {
        const tags = await this.tagRepository.find();
        response.send(tags);

    }

    private createTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const tagData: CreateTagDto = request.body;
        const newTag = this.tagRepository.create({
            ...tagData
        });
        await this.tagRepository.save(newTag);
        response.send(newTag);
    }
}

export default TagController;