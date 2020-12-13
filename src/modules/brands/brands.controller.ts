import { BrandsService } from './brands.service';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessages } from '../../utils/serverMessages.util';
import {
    Controller,
    Request,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
  } from '@nestjs/common';

@Controller('brands')
export class BrandsController {

    constructor(private readonly brandsService: BrandsService) {}

    //START Admin End Points
    @Get('brands-list')
    @UseGuards(AuthGuard())
    public async getBrands( @Request() req): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.brandsService.getBrands();
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('create-brand')
    @UseGuards(AuthGuard())
    public async createBrand(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.brandsService.createBrand(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('edit-brand')
    @UseGuards(AuthGuard())
    public async editBrand(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.brandsService.editBrand(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-brand/:idBrand')
    @UseGuards(AuthGuard())
    public async deleteBrandById( @Request() req, @Param('idBrand') idBrand : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.brandsService.deleteBrandById(idBrand);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    //END Admin End Points


    //START Public End Points
    @Get('brands-list-for-product')
    public async getBrandsProduct(): Promise<ServerMessages> {
        return this.brandsService.getBrandsProduct();
    }
    //END Public End Points
}
