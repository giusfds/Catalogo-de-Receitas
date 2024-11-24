import { Body,Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){ }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body('username') username: string,
        @Body('password') password: string
    ): Promise<AuthResponseDTO>{
        return await this.authService.signIn(username, password);
    }   
}
