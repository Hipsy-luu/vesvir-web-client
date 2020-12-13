import { CardsService } from './cards.service';
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

@Controller('cards')
export class CardsController {

    constructor(private readonly cardsService: CardsService) {}

    //START Admin End Points
    @Post('add-new-customer-card')
    @UseGuards(AuthGuard())
    public async addNewCustomerDirection(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.cardsService.addNewCustomerCard(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-customer-card/:idCard')
    @UseGuards(AuthGuard())
    public async deleteCustomerDirection(@Request() req,@Param('idCard') idCard): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.cardsService.deleteCustomerCard(req.user.idUser,idCard);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    /* @Get('get-customer/:idCustomer')
    @UseGuards(AuthGuard())
    public async deleteUser( @Request() req, @Param('idCustomer') idCustomer : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.cardsService.getCustomerById(idCustomer);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    } */

    /* @Post('update-customer-account-data')
    @UseGuards(AuthGuard())
    public async updateCustomerAccountData(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.cardsService.updateCustomerAccountData(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    } */

    //END Customer End Points
}
