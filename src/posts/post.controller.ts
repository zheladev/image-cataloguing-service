import HttpException from '../exceptions/HttpException';
import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { getRepository } from 'typeorm';
import Post from './post.entity';

class PostsController implements Controller {
    public path = '/posts';
    public router = express.Router();
    private postRepository = getRepository(Post);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private deletePost = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.postRepository.delete(id);
    }
    private modifyPost = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        //TODO: add modifiedBy and modifiedAt attr
        const id = request.params.id;
        const postData: Post = request.body;
        await this.postRepository.update(id, postData);
        const updatedPost = await this.postRepository.findOne(id);
        if (updatedPost) {
            response.send(updatedPost);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const post = await this.postRepository.findOne(id);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.postRepository.find();
        response.send(posts);

    }

    private createPost = async (request: RequestWithUser, response: express.Response) => {
        const postData: CreatePostDto = request.body;
        const newPost = this.postRepository.create({
          ...postData,
          //author: request.user,
        });
        await this.postRepository.save(newPost);
        //newPost.author = undefined;
        response.send(newPost);
    }
}

export default PostsController;