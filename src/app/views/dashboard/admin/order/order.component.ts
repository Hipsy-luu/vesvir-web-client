import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from './../../../../services/utilities/utilities.service';
import { orderDetail } from './orderDetails';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderDetail : any;

  active = 1;

  //
  newStatusSelected : number = -1;

  //Modal variables
  selectedShippingDetails;
  
  @ViewChild("modalShippingDetails") modalShippingDetails;

  constructor(private modalService: NgbModal,public utilitiesService : UtilitiesService) {
    this.orderDetail = orderDetail;
   }

  ngOnInit(): void {
    this.newStatusSelected = -1;
  }

  openModalShippingDetails( details /* modalDirection */) {
    this.selectedShippingDetails = JSON.parse( JSON.stringify(details) );
    this.selectedShippingDetails.date = new Date(details.date);
    
		this.modalService.open(this.modalShippingDetails, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
  }

  //Recibe el estatus del pedido que se quiere volver a notificar al usuario
  resentEmail(typeEmailOpc : number){
    this.utilitiesService.showSuccessToast("Se envió un email al usuario con el estado seleccionado","Éxito")
  }
  //agrega un nuevo estado al historial del pedido
  addNewStatus(newStatusOpc : number){
    this.utilitiesService.showSuccessToast("Se actualizo el ultimo estado del pedido","Éxito");
    this.newStatusSelected = -1;
  }

}
