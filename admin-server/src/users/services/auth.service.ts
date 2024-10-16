import { LoginDto } from './../dto/login.dto';
import { MongoRepository } from 'typeorm';
import { RegisterDto } from './../dto/register.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.mongo.entity';
import { encryptPassword, makeSalt } from 'src/shared/utils/crypto-gram';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepo: MongoRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, password } = registerDto;
    // 检验用户是否存在
    this._checkIfUserExist(name);
    // 为密码加盐
    const { salt, hashPassword } = this._cryptoPassword(password);
    // 参入数据库 user表
    const newUser = new User();
    newUser.name = name;
    newUser.password = hashPassword;
    newUser.salt = salt;
    return await this.userRepo.save(newUser);
  }

  async getUserInfo(id: string) {
    const userDb = await this.userRepo.findOneBy(id);
    console.log(userDb, id, 'uu');
    return Object.assign({}, userDb);
  }

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    // 检查输入
    const user = await this._checkLoginForm(name, password);
    // 签发token
    const payload = { id: user._id };
    const token = this.jwtService.sign(payload);
    return { user, sessionId: `Bearer ${token}` };
  }

  private async _checkIfUserExist(name: string) {
    const user = await this.userRepo.findOneBy({ name });
    if (user) {
      throw new BadRequestException('用户已经存在');
    }
  }

  private _cryptoPassword(password: string) {
    const salt = makeSalt();
    const hashPassword = encryptPassword(password, salt);
    return { salt, hashPassword };
  }

  private async _checkLoginForm(name: string, password: string) {
    const user = await this.userRepo.findOneBy({ name });
    if (!user) {
      throw new InternalServerErrorException('用户不存在');
    }
    const { salt, password: hashPassword } = user;
    if (encryptPassword(password, salt) !== hashPassword) {
      throw new InternalServerErrorException('密码错误');
    }
    return user;
  }
}
