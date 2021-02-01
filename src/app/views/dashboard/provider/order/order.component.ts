import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from './../../../../services/utilities/utilities.service';
import { orderDetail } from './orderDetails';
import { Order, StatusHistory, ShippingPackage } from '../../../../classes/order.class';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ActivatedRoute } from '@angular/router';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {


  orderDetail: Order;
  totalProducts : number;
  totalPayment : number;
  noTotalOrders : number;
  shippingPackagesTotal : number;
  shippingPackageProductTotal: number;

  active = 1;
  activeModal = 1;

  //Modal variables
  newStatusSelected: StatusHistory;
  selectedShippingPackage : ShippingPackage;

  @ViewChild("modalShippingDetails") modalShippingDetails;
  @ViewChild("modalNewState") modalNewState;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(private modalService: NgbModal, public utilitiesService: UtilitiesService, public apiDataService: ApiDataService,
    private dataSessionService: DataSessionService, private activatedRoute: ActivatedRoute,) {
    this.orderDetail = new Order();
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderDetail = new Order();
      this.totalProducts = 0;
      this.totalPayment = 0;
      this.noTotalOrders = 0;
      this.shippingPackagesTotal = 0;
      this.shippingPackageProductTotal = 0;
      this.newStatusSelected = new StatusHistory();
      this.selectedShippingPackage = new ShippingPackage();
      //this.customer = new User();
      //this.selectedDirection = new Direction();
      this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
        //console.log(logedResponse);
        if (this.dataSessionService.user.userType == 0) {
          //Cosas para hacer si es admin
          console.log("es admin");
          
          this.dataSessionService.navigateByUrl("/dashboard-provider/home");
        } else if (this.dataSessionService.user.userType == 1) {
          console.log("es provedor");
          let idOrder: number = parseInt(params.get('idOrder'));

          //console.log(idOrder);
          

          if (idOrder == null || idOrder == undefined) {
            this.dataSessionService.navigateByUrl("/dashboard-provider/orders");
          } else {
            this.loadData(idOrder);
          }
        } else if (this.dataSessionService.user.userType == 2) {
          this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
          this.dataSessionService.logOut();
        } else {
          this.utilitiesService.showErrorToast("Usuario desconocido.", "Error!");
          this.dataSessionService.logOut();
        }
      }, (noLoginResponse: LoggedResponse) => {
        //console.log(noLoginResponse);
        this.dataSessionService.logOut();
      });
    });
  }

  ngOnInit(): void {

  }

  loadData(idOrder: number) {
    //this.customer = new User();
    //this.selectedDirection = new Direction();
    this.apiDataService.getProviderOrderById(idOrder).then((response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);
      if (response.error == true) {
        console.log("error");
        console.log(response);
        
        this.utilitiesService.showWarningToast(response.message, "Error");
        this.dataSessionService.navigateByUrl("/dashboard-provider/orders");
      } else if (response.error == false) {
        //console.log("paso");
        //console.log(response.data);
        response.data.dataOrder.createDate = new Date(response.data.dataOrder.createDate); 
        response.data.dataOrder.customer.createDate = new Date(response.data.dataOrder.customer.createDate); 

        for (let index = 0; index < response.data.dataOrder.statusHistorys.length; index++) {
          response.data.dataOrder.statusHistorys[index].createdAt = new Date(response.data.dataOrder.statusHistorys[index].createdAt);
        }

        for (let index = 0; index < response.data.dataOrder.shippingPackages.length; index++) {
          response.data.dataOrder.shippingPackages[index].createDate = new Date(response.data.dataOrder.shippingPackages[index].createDate);
        }

        for (let index = 0; index < response.data.dataOrder.payments.length; index++) {
          response.data.dataOrder.payments[index].createDate = new Date(response.data.dataOrder.payments[index].createDate);
        }

        this.orderDetail = response.data.dataOrder ;
        for (let index = 0; index < response.data.statusHistorys.length; index++) {
          response.data.statusHistorys[index].createdAt = new Date(response.data.statusHistorys[index].createdAt);
        }
        this.orderDetail.statusHistorys = response.data.statusHistorys ;
        this.totalProducts = response.data.totalProducts ;
        this.totalPayment = response.data.totalPayment.total ;
        this.noTotalOrders = response.data.noTotalOrders;
        this.shippingPackagesTotal = response.data.shippingPackagesTotal;

        this.shippingPackageProductTotal = response.data.shippingPackageProductTotal;
      }

    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");

    });
  }

  openModalShippingDetails(selectedShippingPackage : ShippingPackage /* modalDirection */) {
    this.selectedShippingPackage = JSON.parse(JSON.stringify(selectedShippingPackage));
    this.selectedShippingPackage.createDate = new Date(selectedShippingPackage.createDate);
    //console.log(this.selectedShippingPackage);

    this.modalService.open(this.modalShippingDetails, { ariaLabelledBy: 'modal-basic-title', centered : true, size : 'lg'  }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //Recibe el estatus del pedido que se quiere volver a notificar al usuario
  resentEmail(typeEmailOpc: number) {
    this.utilitiesService.showSuccessToast("Se envió un email al usuario con el estado seleccionado", "Éxito")
  }

  //agrega un nuevo estado al historial del pedido
  openAddNewStatus() {
    this.newStatusSelected = new StatusHistory();

    this.newStatusSelected.idOrder = this.orderDetail.idOrder;
    this.newStatusSelected.registerUserData = this.dataSessionService.user.name + " " + this.dataSessionService.user.surnames;
    this.newStatusSelected.status = 6;

    this.modalService.open(this.modalNewState, { ariaLabelledBy: 'modal-basic-title', centered : true, size : 'lg' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveNewStatus(){
    this.apiDataService.createNewOrderStatus(this.newStatusSelected).then(async (response: ServerMessage) => {
      console.log("exito");
      console.log(response);
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
      } else if (response.error == false) {
        console.log("guardo");

        this.loadData(this.orderDetail.idOrder);
        await this.utilitiesService.sleep(1500);

        this.utilitiesService.showSuccessToast("Se actualizo el ultimo estado del pedido", "Éxito");
        this.modalService.dismissAll();
        this.newStatusSelected = new StatusHistory();
      }

    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");

    });
  }

  updatePrivateNote() {
    this.apiDataService.updateOrderPrivateNote(this.orderDetail.idOrder , this.orderDetail.privateNote ).then(async (response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);
      if (response.error == true) {
        console.log("error");
        console.log(response);
        
        this.utilitiesService.showWarningToast(response.message, "Error");
      } else if (response.error == false) {
        //console.log("guardo");
        //this.loadData(this.orderDetail.idOrder);
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
      }

    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
    });
  }

  createInvoice(idPayment) {
    this.utilitiesService.showSuccessToast("Factura creada con exito", "Éxito");
  }

  backClicked() {
    this.dataSessionService.navigateByUrl("/dashboard-provider/orders");
  }

}
