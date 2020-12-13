import { ProductsService } from './products.service';
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

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    //START Admin End Points
    @Get('category-products-list/:idCategory')
    @UseGuards(AuthGuard())
    public async getProductsByCategoryAdmin( @Request() req, @Param('idCategory') idCategory : number): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.productsService.getProductsByCategoryAdmin(idCategory);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('get-product-admin/:idProduct')
    @UseGuards(AuthGuard())
    public async getProductAdminById( @Request() req, @Param('idProduct') idProduct : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.productsService.getProductAdminById(idProduct);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }
    //END Admin End Points

    //START Provider End Points
    @Get('products-list')
    @UseGuards(AuthGuard())
    public async getProviders( @Request() req): Promise<ServerMessages> {
        if(req.user.userType == 1){
            return this.productsService.getProductsProvider(req.user.idUser);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('get-product/:idProduct')
    @UseGuards(AuthGuard())
    public async getProductById( @Request() req, @Param('idProduct') idProduct : string): Promise<ServerMessages> {
        if(req.user.userType == 1){
            return this.productsService.getProductById(idProduct,req.user.idUser);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('create-product')
    @UseGuards(AuthGuard())
    public async createProduct(@Request() req : any, @Body() newProduct): Promise<ServerMessages> {
        if (req.user.userType == 1) {
            return this.productsService.createProduct(newProduct, req.user.idUser);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('edit-product')
    @UseGuards(AuthGuard())
    public async editProduct(@Request() req : any, @Body() newProduct): Promise<ServerMessages> {
        if (req.user.userType == 1) {
            return this.productsService.editProduct(newProduct, req.user.idUser);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('add-product-quantity')
    @UseGuards(AuthGuard())
    public async addProductQuantity(@Request() req : any, @Body() newQuantity): Promise<ServerMessages> {
        if (req.user.userType == 1) {
            return this.productsService.addProductQuantity(newQuantity, req.user.idUser);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-product-quantity')
    @UseGuards(AuthGuard())
    public async updateProductQuantity(@Request() req : any, @Body() updatedQuantity): Promise<ServerMessages> {
        if (req.user.userType == 1) {
            return this.productsService.updateProductQuantity(updatedQuantity, req.user.idUser);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-product-quantity/:idQuantity')
    @UseGuards(AuthGuard())
    public async deleteQuantityById( @Request() req, @Param('idQuantity') idQuantity : string): Promise<ServerMessages> {
        if(req.user.userType == 1){
            return this.productsService.deleteProductQuantity(idQuantity,req.user.idUser);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('add-product-image')
    @UseGuards(AuthGuard())
    public async addProductImage(@Request() req : any, @Body() newImageData): Promise<ServerMessages> {
        if (req.user.userType == 1) {
            return this.productsService.addProductImage(newImageData , req.user.idUser);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('edit-product-images')
    @UseGuards(AuthGuard())
    public async editProductImages(@Request() req : any, @Body() newImagesData): Promise<ServerMessages> {
        if (req.user.userType == 1) {
            return this.productsService.editProductImages(newImagesData , req.user.idUser);
        } else {
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    
    //END Provider End Points

}
