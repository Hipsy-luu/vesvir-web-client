import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Customer , Direction} from '../../../../classes/customer.class';
import { dataCustomer } from './customer';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @ViewChild("modalDirection") modalDirection;
  @ViewChild("modalConfirmDirectionDelete") modalConfirmDirectionDelete;

  customer : Customer = new Customer();
  modelCustomerBirthDay : NgbDateStruct;
  date: {year: number, month: number,day: number};
  selectedDirection : Direction = new Direction();

  constructor(private _location: Location,private modalService: NgbModal,private utilitiesService:UtilitiesService,private calendar: NgbCalendar) { 
    this.customer = dataCustomer;
  }

  async ngOnInit() {
    /* await this.utilitiesService.sleep(1000)
    this.modalService.open(this.modalDirection, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }); */
    
    this.modelCustomerBirthDay =  {
      year: this.customer.birthDay.getFullYear(),
      month: parseInt( this.customer.birthDay.toLocaleDateString("es-MX",{month : "2-digit"}) ),
      day: parseInt( this.customer.birthDay.toLocaleDateString("es-MX",{day : "2-digit"}) )
    }
  }

  openModalEditDirection( direction /* modalDirection */) {
    this.selectedDirection = JSON.parse( JSON.stringify(direction) );
    
		this.modalService.open(this.modalDirection, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
  }

  openModalConfirmDeleteDirection( ) {
		this.modalService.open(this.modalConfirmDirectionDelete, {ariaLabelledBy: 'modal-basic-title',centered: true}).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
  }

  confirmDeleteDirection( directionId ) {
    this.customer.directions = this.customer.directions.filter((direction)=>{
      return direction.idDirection != directionId;
    });

    let defaultDeleted = true;

    for (let index = 0; index < this.customer.directions.length; index++) {
      const element = this.customer.directions[index];
      if(this.customer.directions[index].default == true){
        defaultDeleted = false;
      }
    }

    if(defaultDeleted == true && this.customer.directions.length > 0){
      this.customer.directions[0].default = true;
    }


		this.modalService.dismissAll();
  }
  
  setDefaultDirection(){
    for (let index = 0; index < this.customer.directions.length; index++) {
      if(this.customer.directions[index].idDirection != this.selectedDirection.idDirection){
        this.customer.directions[index].default = false; 
      }else if(this.selectedDirection.default== false){
        this.customer.directions[0].default = true;
      }

      if(this.customer.directions[index].idDirection == this.selectedDirection.idDirection){
        this.customer.directions[index].default = this.selectedDirection.default; 
      }
    }
  }

  backClicked() {
    this._location.back();
  }
}
