import * as bcrypt from 'bcrypt';
import EmailAlreadyInUseException from '../exceptions/EmailAlreadyInUseException';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../dtos/user.dto';
import User from './../models/user.model';
import LogInDto from './logIn.dto';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

class AuthenticationService {
    private userRepository = getRepository(User);

    public async logIn(data: LogInDto) {
        const user = await this.userRepository.findOne({ email: data.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(data.password, user.password);
            if(isPasswordMatching) {
                user.password = undefined;
                const tokenData = this.createToken(user);
                const cookie = this.createCookie(tokenData);
                return {
                    cookie,
                    user
                };
            } else {
                throw new WrongCredentialsException();
            }
        } else {
            throw new WrongCredentialsException();
        }
    }

    public async register(userData: CreateUserDto) {
        if (await this.userRepository.findOne({ email: userData.email })) {
            throw new EmailAlreadyInUseException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        await this.userRepository.save(user);
        user.password = undefined;
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}

export default AuthenticationService;