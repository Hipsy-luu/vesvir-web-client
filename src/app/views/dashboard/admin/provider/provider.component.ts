import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Customer , Direction} from '../../../../classes/customer.class';
import { dataCustomer } from './provider';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {

  @ViewChild("modalConfirmProviderDelete") modalConfirmProviderDelete;

  customer : Customer = new Customer();
  modelCustomerBirthDay : NgbDateStruct;
  date: {year: number, month: number,day: number};

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

  openModalConfirmDeleteProvider( ) {
		this.modalService.open(this.modalConfirmProviderDelete, {ariaLabelledBy: 'modal-basic-title',centered: true}).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
  }

  confirmDeleteDirection( directionId ) {

		this.modalService.dismissAll();
  }

  backClicked() {
    this._location.back();
  }

}
