import Controller from "interfaces/controller.interface";
import * as express from 'express';
import { getRepository } from "typeorm";
import Image from "../models/image.model";
import CreateImageDto from "../dtos/image.dto";
import validationMiddleware from "../middleware/validation.middleware";

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
        const newImage = this.imageRepository.create({
            ...imageData
        });
        await this.imageRepository.save(newImage);
        response.send(newImage);
    }
}

export default ImageController;