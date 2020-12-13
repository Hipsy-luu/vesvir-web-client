import { ProvidersService } from './providers.service';
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


@Controller('providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {}

    //START Admin End Points
    @Get('providers-list')
    @UseGuards(AuthGuard())
    public async getProviders( @Request() req): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.getProviders(req.user.email);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('get-provider/:idProvider')
    @UseGuards(AuthGuard())
    public async getProviderById( @Request() req, @Param('idProvider') idProvider : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.getProviderById(idProvider);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-provider-account-data')
    @UseGuards(AuthGuard())
    public async updateProviderAccountData(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.updateProviderAccountData(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-provider-billing-data')
    @UseGuards(AuthGuard())
    public async updateProviderBillingData(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.updateProviderBillingData(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    /* @Post('add-direction-customer')
    @UseGuards(AuthGuard())
    public async addDirectionCustomer(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.addDirectionCustomer(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    } */

    @Post('save-directions-provider')
    @UseGuards(AuthGuard())
    public async saveDirectionsProvider(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.saveDirectionsProvider(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    /* @Get('delete-direction-customer/:idDirection')
    @UseGuards(AuthGuard())
    public async deleteDirectionCustomer(@Request() req,@Param('idDirection') idDirection): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.deleteDirectionCustomer(idDirection);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    } */

    @Get('change-provider-automatic-pass/:idProvider')
    @UseGuards(AuthGuard())
    public async updateProviderPassword(@Request() req, @Param('idProvider') idProvider : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.updateProviderPassword( idProvider);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('desactive-provider/:idProvider')
    @UseGuards(AuthGuard())
    public async deleteCustomer(@Request() req, @Param('idProvider') idProvider : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.providersService.desactiveProvider( idProvider);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    //END Admin End Points
}
