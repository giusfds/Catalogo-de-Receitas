import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDTO } from './auth.dto';
import {compareSync as bcryptCompareSync} from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private jwtExpirationTimeInSeconds: number;
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService
            ) {
                this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
            }
    
    async signIn(username: string, password: string): Promise<AuthResponseDTO>{
        const foundUser = await this.usersService.findByUsername(username);

        if(!foundUser  || !bcryptCompareSync(password, foundUser.password)){
            throw new UnauthorizedException();
        }

        const payload = {sub: foundUser.id, username: foundUser.username}

        const token = this.jwtService.sign(payload);

        return { token, expiresIn: this.jwtExpirationTimeInSeconds};
    }
    
}
     