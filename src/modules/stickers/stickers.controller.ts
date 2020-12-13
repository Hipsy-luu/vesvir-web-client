import { StickersService } from './stickers.service';
import { AuthGuard } from '@nestjs/passport';
import {
    Controller,
    Request,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
} from '@nestjs/common';
import { ServerMessages } from '../../utils/serverMessages.util';


@Controller('stickers')
export class StickersController {
    constructor(private readonly stickersService: StickersService) { }

    //START Admin End Points
    @Post('add-product-sticker')
    @UseGuards(AuthGuard())
    public async addProductSticker(@Request() req : any, @Body() newStickerData): Promise<ServerMessages> {
        if (req.user.userType == 0) {
            return this.stickersService.addProductSticker(newStickerData);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('edit-product-stickers')
    @UseGuards(AuthGuard())
    public async editProductStickers(@Request() req : any, @Body() newStickersData): Promise<ServerMessages> {
        if (req.user.userType == 0) {
            return this.stickersService.editProductStickers( newStickersData );
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }
    //END Admin End Points
}
