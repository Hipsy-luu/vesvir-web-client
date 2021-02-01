import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(private toastr: ToastrService) {}

  getOnlyDate(string) {
    let montNum = new Date(string).getUTCMonth() + 1;
    let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
    return "" + new Date(string).getFullYear() + "-" + fixMont + "-" + new Date(string).getDate();
  }

  getOnlyTime(string) {
    const birthday = new Date(string);
    let fixMin = birthday.getMinutes().toString().length == 1 ? "0" + birthday.getMinutes() : birthday.getMinutes();
    return "" + birthday.getHours() + ":" + fixMin;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  camelize(str : string) {
    let temp : string[] = str.split(" ");
    let tempString = this.capitalizeFirstLetter( temp[0] );

    for (let index = 1; index < temp.length; index++) {
      tempString = tempString + " " + this.capitalizeFirstLetter( temp[index] ) ;
      
    }
    return tempString;
  }

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
