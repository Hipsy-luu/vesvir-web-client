import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { Category } from '../../../../classes/category.class';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.css']
})
export class CategorysComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  searchValue: String = "";
  selectedGenre = -1;
  selectedStatus = -1;

  categoriesGenres: Category[];
  categoriesFiltered: Category[];

  selectedCategory: Category;

  @ViewChild("modalAddCategory") modalAddCategory;
  @ViewChild("modalConfirmDeleteCategory") modalConfirmDeleteCategory;

  constructor(private modalService: NgbModal, private apiDataService: ApiDataService, public dataSessionService: DataSessionService,
    private utilitiesService: UtilitiesService) {
    this.categoriesGenres = [];
    this.categoriesFiltered = Array.from(this.categoriesGenres);
    this.selectedCategory = new Category();

    
  }

  async ngOnInit() {
    this.dataSessionService.checkLogin(async (logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0 ) {
        //Cosas para hacer si es admin
        console.log("es admin");
        /* await this.utilitiesService.sleep(1000);
        this.openModalAddCategory(); */
        this.loadData();
      } else if (this.dataSessionService.user.userType == 1 ) {
        console.log("es provedor");
        this.dataSessionService.navigateByUrl("/dashboard-provider/home");
      }else if (this.dataSessionService.user.userType == 2) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.logOut();
      }else{
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  ////////Search and filter functions

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    this.selectedGenre = -1;
    if (this.searchValue == "") {
      this.categoriesFiltered = Array.from(this.categoriesGenres);
    } else {
      this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
        let fixed = category.name.charAt(0).toUpperCase() + event.slice(1);
        return category.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  changeGenreSelected(newSelectedGenre: number,selectedStatus) {
    this.selectedGenre = newSelectedGenre;
    this.searchValue = "";

    if (newSelectedGenre == -1) {
      if (selectedStatus == -1) {
        this.categoriesFiltered = Array.from(this.categoriesGenres);
      }else{
        this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
          return category.active == (selectedStatus == 0 ? true : false) ;
        });
      }
    } else {
      if (selectedStatus == -1) {
        this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
          return category.genre == newSelectedGenre;
        });
      } else {
        this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
          return category.active == (selectedStatus == 0 ? true : false) && category.genre == newSelectedGenre ;
        });
      }
    }
  }

  changeStatusSelected(newSelectedStatus: number,selectedGenre) {
    this.selectedStatus = newSelectedStatus;
    this.searchValue = "";
    
    if (newSelectedStatus == -1) {
      if (selectedGenre == -1) {
        this.categoriesFiltered = Array.from(this.categoriesGenres);
      }else{
        this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
          return category.genre == selectedGenre;
        });
      }
    } else {
      if (selectedGenre == -1) {
        this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
          return category.active == (newSelectedStatus == 0 ? true : false) ;
        });
      } else {
        this.categoriesFiltered = this.categoriesGenres.filter(function (category) {
          return category.active == (newSelectedStatus == 0 ? true : false) && category.genre == selectedGenre ;
        });
      }
    }
  }

  ////////////////
  openModalAddCategory( /* modalDirection */) {
    this.selectedCategory = new Category();

    this.modalService.open(this.modalAddCategory, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalEditCategory( category : Category) {
    this.selectedCategory = JSON.parse( JSON.stringify( category ) );

    this.modalService.open(this.modalAddCategory, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteCategory(category : Category) {
    this.selectedCategory = JSON.parse( JSON.stringify( category ) );
    
    this.modalService.open(this.modalConfirmDeleteCategory, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async loadData(){
    this.categoriesGenres = [];
    this.categoriesFiltered = Array.from(this.categoriesGenres);
    this.selectedCategory = new Category();

    this.dataSessionService.getAdminMenu();
    
    this.apiDataService.getCategoriesListData().then((response : ServerMessage)=>{
      //console.log(response);
      for (let index = 0; index < response.data.length; index++) {
        response.data[index].createDate = new Date(response.data[index].createDate);
      }
      this.categoriesGenres = [...response.data];
      this.categoriesFiltered = Array.from(this.categoriesGenres);
    }).catch((error)=>{
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error","Error");
    });
  }

  addCategory() {
    this.apiDataService.createCategory(this.selectedCategory).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.loadData();
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  editCategory() {
    this.apiDataService.editCategory(this.selectedCategory).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.loadData();
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  deleteCategory() {
    this.apiDataService.deleteCategory(this.selectedCategory.idCategory).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.loadData();
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }
}
