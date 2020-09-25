import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(private toastr: ToastrService) {}

  //TOAST
  showSuccessToast(message : string , title : string) {
    this.toastr.success(message, title);
  }
  
  showErrorToast(message : string , title : string) {
    this.toastr.error(message, title);
  }

  showWarningToast(message : string , title : string) {
    this.toastr.warning(message, title);
  }

  showInfoToast(message : string) {
    this.toastr.info(message);
  }
  //END. TOAST

  //XX/XX
  formatDate1(dateToFix : Date) : string {
    return dateToFix.toLocaleDateString("es-MX",{day: "2-digit",month : "2-digit",year: "numeric"});
  }

  formatDate2(dateToFix : Date) : string {
    return dateToFix.toLocaleDateString("es-MX",{year: "numeric"})+ '-'+
    dateToFix.toLocaleDateString("es-MX",{month : "2-digit"})+ '-'+
    dateToFix.toLocaleDateString("es-MX",{day: "2-digit"});
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
