import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService){

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'UxKeyMyBand'
        });

    }

    //If the validation succeeds, the validate() method returns the user record. Otherwise, it returns null
    //Esta funcion es el middleware que se ejecuta cuando la ruta requiere el token en el header
    async validate(payload: JwtPayload){
        const user = await this.authService.validateUserByJwt(payload);
        //console.log(user)
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }

}