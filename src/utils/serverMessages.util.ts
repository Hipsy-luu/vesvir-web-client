export class ServerMessages {
  error: Boolean;
  message: String;
  data: any;

  constructor(err : boolean , mess : string , dat : any){
    this.error = err;
    this.message = mess;
    this.data = dat;
  }
}