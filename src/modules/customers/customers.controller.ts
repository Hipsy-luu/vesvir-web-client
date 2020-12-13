import { CustomersService } from './customers.service';
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

@Controller('customers')
export class CustomersController {

    constructor(private readonly customersService: CustomersService) {}

    //START Admin End Points
    @Get('customers-list')
    @UseGuards(AuthGuard())
    public async getUsers( @Request() req): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.getCustomersList(req.user.email);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('get-customer/:idCustomer')
    @UseGuards(AuthGuard())
    public async deleteUser( @Request() req, @Param('idCustomer') idCustomer : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.getCustomerById(idCustomer);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-account-data')
    @UseGuards(AuthGuard())
    public async updateCustomerAccountData(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.updateCustomerAccountData(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-billing-data')
    @UseGuards(AuthGuard())
    public async updateCustomerBillingData(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.updateCustomerBillingData(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('add-direction-customer')
    @UseGuards(AuthGuard())
    public async addDirectionCustomer(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.addDirectionCustomer(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('save-directions-customer')
    @UseGuards(AuthGuard())
    public async saveDirectionsCustomer(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.saveDirectionsCustomer(body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-direction-customer/:idDirection')
    @UseGuards(AuthGuard())
    public async deleteDirectionCustomer(@Request() req,@Param('idDirection') idDirection): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.deleteDirectionCustomer(idDirection);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('change-customer-automatic-pass/:idCustomer')
    @UseGuards(AuthGuard())
    public async resetCustomerPassword(@Request() req, @Param('idCustomer') idCustomer : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.resetCustomerPassword( idCustomer);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-customer/:idCustomer')
    @UseGuards(AuthGuard())
    public async deleteCustomer(@Request() req, @Param('idCustomer') idCustomer : string): Promise<ServerMessages> {
        if(req.user.userType == 0){
            return this.customersService.deleteCustomer( idCustomer);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    //END Admin End Points



    //START Customer End Points
    @Post('update-customer-name-surname')
    @UseGuards(AuthGuard())
    public async updateCustomerNameSurnames(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateCustomerNameSurnames(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }
    
    @Post('update-customer-birthday')
    @UseGuards(AuthGuard())
    public async updateCustomerBirthday(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateCustomerBirthday(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-password')
    @UseGuards(AuthGuard())
    public async updateCustomerPassword(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateCustomerPassword(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-gender')
    @UseGuards(AuthGuard())
    public async updateCustomerGender(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateCustomerGender(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-phone')
    @UseGuards(AuthGuard())
    public async updateCustomerPhone(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateCustomerPhone(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-billing-information')
    @UseGuards(AuthGuard())
    public async updateCustomerBillingInformation(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateCustomerBillingInformation(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('add-new-customer-direction')
    @UseGuards(AuthGuard())
    public async addNewCustomerDirection(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.addNewCustomerDirection(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Post('update-customer-directions')
    @UseGuards(AuthGuard())
    public async updateDirectionsCustomer(@Request() req,@Body() body): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.updateDirectionsCustomer(req.user.idUser,body);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    @Get('delete-customer-direction/:idDirection')
    @UseGuards(AuthGuard())
    public async deleteCustomerDirection(@Request() req,@Param('idDirection') idDirection): Promise<ServerMessages> {
        if(req.user.userType == 2){
            return this.customersService.deleteCustomerDirection(req.user.idUser,idDirection);
        }else{
            return new ServerMessages(true, "Permisos inválidos", {})
        }
    }

    //END Customer End Points
}
