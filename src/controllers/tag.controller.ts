import Controller from "interfaces/controller.interface";
import * as express from 'express';
import { getRepository } from "typeorm";
import Tag from "../models/tag.model";
import CreateTagDto from "../dtos/tag.dto";
import validationMiddleware from "../middleware/validation.middleware";
import TagNotFoundException from "../exceptions/TagNotFoundException";

class TagController implements Controller {
    public path = '/tags';
    public router = express.Router();
    private tagRepository = getRepository(Tag);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router
        //     .all(`${this.path}/*`, authMiddleware);
        this.router.get(this.path, this.getAllTags);
        this.router.get(`${this.path}/:id`, this.getTagById);
        this.router.patch(`${this.path}/:id`, this.modifyTag);
        this.router.post(this.path, validationMiddleware(CreateTagDto), this.createTag);
        this.router.delete(`${this.path}/:id`, this.deleteTag);
    }

    private getAllTags = async (request: express.Request, response: express.Response) => {
        const tags = await this.tagRepository.find();
        response.send(tags);
    }

    private getTagById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const tagId = request.params.id;
        const post = await this.tagRepository.findOne(tagId);

        if (post) {
            response.send(post);
        } else {
            next(new TagNotFoundException(tagId));
        }
    }

    private modifyTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        //TODO: add modifiedBy and modifiedAt attr
        const tagId = request.params.id;
        const tagData: Tag = request.body;
        await this.tagRepository.update(tagId, tagData);
        const updatedTag = await this.tagRepository.findOne(tagId);

        if (updatedTag) {
            response.send(updatedTag);
        } else {
            next(new TagNotFoundException(tagId));
        }
    }
    private createTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const tagData: CreateTagDto = request.body;
        const newTag = this.tagRepository.create({
            ...tagData
        });
        await this.tagRepository.save(newTag);
        response.send(newTag);
    }

    private deleteTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const tagId: string = request.params.id;
        const deleteResponse = await this.tagRepository.delete(tagId);
        if (deleteResponse.affected > 0) {
            response.send({ response: "deleted" });
        } else {
            next(new TagNotFoundException(tagId))
        }
        
    }
}

export default TagController;