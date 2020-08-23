import Controller from "interfaces/controller.interface";
import * as express from 'express';
import { getRepository } from "typeorm";
import Image from "../models/image.model";
import CreateImageDto from "../dtos/image.dto";
import validationMiddleware from "../middleware/validation.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";

class ImageController implements Controller {
    public path = '/images';
    public router = express.Router();
    private imageRepository = getRepository(Image);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllImages);
        this.router.post(this.path, validationMiddleware(CreateImageDto), this.createImage);
    }

    private getAllImages = async (request: express.Request, response: express.Response) => {
        const images = await this.imageRepository.find();
        response.send(images);
    }

    private createImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageData: CreateImageDto = request.body;
        const tagIds = imageData.tags;
        const newTags = imageData.newTags;
        const tags: Array<string> = [];
        //TODO
        if (!tagIds) {

        }

        const newImage = this.imageRepository.create({
            name: imageData.name,
            path: 'aa', //change
        });

        await this.imageRepository.save(newImage);
        response.send(newImage);
    }
}

export default ImageController;