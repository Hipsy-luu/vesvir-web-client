
import { CreateUserDto } from '../modules/user/dto/createUser.dto';

export const validators = 
    {
      validateUser: (newUser : CreateUserDto) => {
        var errors = [];

        if(newUser.password){

        }

        if(errors.length == 0){
            return true;
        }else{
            return false;
        }
      }
    }
  ;