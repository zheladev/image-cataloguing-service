import Controller from "interfaces/controller.interface";
import * as express from 'express';
import * as fs from 'fs';
import { Any, getRepository, ObjectLiteral } from "typeorm";
import Image from "../models/image.model";
import CreateImageDto from "../dtos/image.dto";
import validationMiddleware from "../middleware/validation.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import Tag from "../models/tag.model";
import HttpException from "../exceptions/HttpException";
import ImageNotFoundException from "../exceptions/ImageNotFoundException";

class ImageController implements Controller {
    public path = '/images';
    public router = express.Router();
    private imageRepository = getRepository(Image);
    private tagRepository = getRepository(Tag);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllImages);
        this.router.get(`${this.path}/:id`, this.getImageById);
        this.router.post(this.path, validationMiddleware(CreateImageDto), this.createImage);
    }

    private getAllImages = async (request: express.Request, response: express.Response) => {
        const images = await this.imageRepository.find({ relations: ["tags"]});
        response.send(images);
    }

    
    private getImageById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageId = request.params.id;
        //TODO: make sure it's uuid, maybe as middleware?
        try {
            const image = await this.imageRepository.findOne(imageId, { relations: ["tags"]});

            if (image) {
                response.send( {...image, imagePath: `img/${image.id}.${image.format}` }); //TODO: remove ugly hack to get path
            } else {
                throw new ImageNotFoundException(imageId);
            }
        } catch (error) {
            next(error);
        }

    }

    private createImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageData: CreateImageDto = request.body;
        const tags = await this._getExistingTagIds(imageData.tags);
        const fileFormat = imageData.base64data.substring("data:image/".length, imageData.base64data.indexOf(";base64"));
        const base64Data = imageData.base64data.replace(/^data:image\/([a-z]*);base64,/, "");
        const baseDir = './public/img';

        const newImage = this.imageRepository.create({
            name: imageData.name,
            format: fileFormat,
            dir: baseDir,
            tags: tags,
        });

        try {
            const img = await this.imageRepository.save(newImage);
            fs.writeFile(`${baseDir}/${img.id}.${fileFormat}`, base64Data, {encoding: 'base64'}, () => {});
        } catch (error) {
            next(error); //TODO: add exception class
        }
        
        response.send(newImage);
    }

    private _getExistingTagIds = async (rawTags: Array<string>) => {
        if (rawTags && rawTags.length === 0) { return [] };
        let tags = [];

        tags = await this.tagRepository.find({
            name: Any(rawTags)
        });

        const newTagNames = rawTags.filter((tagName: string) => {
            return !tags.some((tag: Tag) => tag.name === tagName);;
        });

        if (newTagNames.length > 0) {
            const { identifiers } = await this.tagRepository.createQueryBuilder()
                .insert().into(Tag)
                .values(newTagNames.map((tagName: string) => ({ name: tagName })))
                .execute();

            const newTags = await this.tagRepository.find({
                    id: Any(identifiers.map((identifier: ObjectLiteral) => identifier.id))
                })

            tags = tags.concat(newTags);
        }
        return tags;
    }
}

export default ImageController;