import { CategoriesService } from './categories.service';
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

@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    //START Admin End Points
    @Get('categories-list')
    @UseGuards(AuthGuard())
    public async getProviders( @Request() req): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.categoriesService.getCategories();
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('create-category')
    @UseGuards(AuthGuard())
    public async createCategory(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.categoriesService.createCategory(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('edit-category')
    @UseGuards(AuthGuard())
    public async editCategory(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.categoriesService.editCategory(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-category/:idCategory')
    @UseGuards(AuthGuard())
    public async getProviderById( @Request() req, @Param('idCategory') idCategory : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.categoriesService.deleteCategory(idCategory);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }
    @Get('categories-admin-menu-list')
    @UseGuards(AuthGuard())
    public async getMenuAdminCategories( @Request() req,): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.categoriesService.getMenuAdminCategories();
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    //END Admin End Points

    //START Public End Points
    @Get('categories-genre-menu-list')
    @UseGuards(AuthGuard())
    public async getGenreCategories( /* @Request() req */ ): Promise<ServerMessages> {
        return this.categoriesService.getGenreCategories();
    }
    //END Public End Points

    //START Public End Points
    
    //END Public End Points

    
}
