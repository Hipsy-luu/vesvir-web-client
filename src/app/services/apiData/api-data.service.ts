import { Product, Quantity, ProductImage, ProductStickers } from './../../classes/product.class';
import { Brand } from './../../classes/brand.class';
import { Category } from './../../classes/category.class';
import { Injectable } from '@angular/core';
import { deployConf } from './../../utils/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { ServerMessage } from '../../classes/serverMessage.class';
import { User, Direction } from '../../classes/user.class';
import { StatusHistory } from '../../classes/order.class';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;
  token: String;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  setToken(newToken : String){
    this.token = newToken;
  }

  getImage(url : string) : Promise<any> {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });
      
      this.http.get(url, { headers: headers,responseType: 'blob' })
      .pipe(
        timeout(2000),
        catchError(e => {
          // do something on a timeout
          //reject(e);
          return of(null);
        })
      ).subscribe((imageBlob)=>{
        let objectURL = "";
        if(imageBlob!=null && imageBlob!=undefined){
          objectURL = URL.createObjectURL(imageBlob);
        }
        resolve(this.sanitizer.bypassSecurityTrustUrl(objectURL) );
      },(error : ServerMessage)=>{
        reject(error)
      });
    })
  }  

  //USER END-POINTS
  doLogin(email : String, password : String) {
    return new Promise((resolve,reject)=>{
      const data = {email : email , password : password};

      this.http.post(this.baseURL + 'login',data,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getUserData(token : String) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      })
       
      this.http.get(this.baseURL + 'login/validate-token',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getAdminHomeData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'user/home-admin-data',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateUser(updatedUser : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'user/update-user',updatedUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
  
  async changePasswordUser(idUser : Number,newPassword : String,){
    return new Promise((resolve,reject)=>{
      const data = {
        idUser : idUser,
        newPassword : newPassword,
      };
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'user/change-user-pass',data,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  
  
  //CUSTOMERS END-POINTS

  getCustomerListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'customers/customers-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }


  getCustomerData( idCustomer : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'customers/get-customer/'+idCustomer,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateCustomerAccountData(updatedUser : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'customers/update-customer-account-data',updatedUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateCustomerBillingData(updatedUser : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'customers/update-customer-billing-data',updatedUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async addDirectionCustomer(newDirection : Direction){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'customers/add-direction-customer',newDirection,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async saveDirectionsCustomer(newDirections : Direction[]){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'customers/save-directions-customer',newDirections,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteDirectionsCustomer(idDirection : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'customers/delete-direction-customer/'+idDirection,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteCustomer(idCustomer : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'customers/delete-customer/'+idCustomer,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async changePasswordCustomer(idCustomer : Number,){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'customers/change-customer-automatic-pass/'+idCustomer,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //END CUSTOMERS END-POINTS

  //ORDERS END-POINT
  getAdminOrdersListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'orders/orders-admin-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getAdminOrderById(idOrder : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'orders/order-admin-by-id/'+idOrder,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateOrderPrivateNote( idOrder : number , privateNote : string ){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      let data = {
        idOrder : idOrder,
        privateNote : privateNote
      };

      this.http.post(this.baseURL + 'orders/update-order-private-note',data,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getProviderOrdersListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'orders/orders-provider-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getProviderOrderById(idOrder : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'orders/order-provider-by-id/'+idOrder,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
  //END ORDERS END-POINT
  
  //STATUS END-POINTS

  async createNewOrderStatus(newStatusHistory : StatusHistory){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'orders/new-order-status',newStatusHistory,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
  
  
  //END STATUS END-POINT

  //COMMENTS END-POINTS
  getCommentsListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'products/comments-list-data',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  approveDisapproveReview( idReview : string ) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'products/approve-disapproved-review/'+idReview,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //END COMMENTS END-POINT

  //PROVIDERS END-POINTS

  getProviderHomeData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'providers/home-provider-data',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getProvidersListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'providers/providers-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }


  getProviderData( idProvider : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'providers/get-provider/'+idProvider,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateProviderAccountData(updatedProvider : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'providers/update-provider-account-data',updatedProvider,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateProviderBillingData(updatedUser : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'providers/update-provider-billing-data',updatedUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

/*   async addDirectionCustomer(newDirection : Direction){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'providers/add-direction-customer',newDirection,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  } */

  async saveDirectionsProvider(updatedDirections : Direction[]){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'providers/save-directions-provider',updatedDirections,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

/*   async deleteDirectionsCustomer(idDirection : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'providers/delete-direction-customer/'+idDirection,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  } */

  async desactiveProvider(idProvider : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'providers/desactive-provider/'+idProvider,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async changePasswordProvider(idProvider : Number,){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'providers/change-provider-automatic-pass/'+idProvider,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //END PROVIDERS END-POINTS

  
  //CATEGORIES END-POINTS
  async createCategory(newCategory : Category){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'categories/create-category',newCategory,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async editCategory(updatedCategory : Category){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'categories/edit-category',updatedCategory,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteCategory(idCategory : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'categories/delete-category/'+idCategory,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getCategoriesListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'categories/categories-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //MENU
  getCategoriesMenuAdminData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'categories/categories-admin-menu-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //END CATEGORIES END-POINTS

  //BRANDS END-POINTS
  async createBrand(newBrand : Brand){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'brands/create-brand',newBrand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async editBrand(updatedBrand : Brand){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'brands/edit-brand',updatedBrand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteBrand(idBrand : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'brands/delete-brand/'+idBrand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getBrandsListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'brands/brands-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async uploadImageBrand(formData: FormData) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'uploads/brand-image/', formData, { headers: headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if (res.error == undefined) {
            console.log("error no llego nada");
            reject(res);
          } else {
            resolve(res);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  deleteImageBrand(idBrand) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });
      this.http.get(this.baseURL + 'uploads/brand-delete-image/' + idBrand, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(new ServerMessage(true, "A ocurrido un error inesperado", error));
      });
    });
  }

  //END BRANDS END-POINTS
  

  //PRODUCT END-POINTS
  getProductsListData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'products/products-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getProductsByCategoryAdmin(idCategory : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'products/category-products-list/'+idCategory,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getCategoriesGenre() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'categories/categories-genre-menu-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getBrandsProduct() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'brands/brands-list-for-product',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async getProductData( idProduct : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'products/get-product/'+idProduct,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async getProductAdminData( idProduct : number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'products/get-product-admin/'+idProduct,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async createProduct(newProduct : Product){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/create-product',newProduct,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async editProduct(updatedProduct : Product){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/edit-product',updatedProduct,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteProduct(idProduct : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'products/delete-provider-product/'+idProduct,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async addProductQuantity(newProductQuantity : Quantity){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/add-product-quantity',newProductQuantity,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateProductQuantity(newProductQuantity : Quantity){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/update-product-quantity',newProductQuantity,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteQuantity(idQuantity : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'products/delete-product-quantity/'+idQuantity,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  } 

  async addProductImage(newProductImage : ProductImage){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/add-product-image',newProductImage,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async editProductImages(newProductImagesData : ProductImage[]){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/edit-product-images',newProductImagesData,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async uploadImageProduct(formData: FormData) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'uploads/product-image/', formData, { headers: headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if (res.error == undefined) {
            console.log("error no llego nada");
            reject(res);
          } else {
            resolve(res);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  async deleteProductImage(idProductImage : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'uploads/product-delete-image/'+idProductImage,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //END PRODUCT END-POINTS


  //STICKERS END-POINTS

  async addProductSticker(newProductSticker : ProductStickers){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'stickers/add-product-sticker',newProductSticker,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async editProductStickers(newProductStickers : ProductStickers[]){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'stickers/edit-product-stickers',newProductStickers,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async uploadStickerProduct(formData: FormData) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'uploads/product-sticker/', formData, { headers: headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if (res.error == undefined) {
            console.log("error no llego nada");
            reject(res);
          } else {
            resolve(res);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  async deleteProductSticker(idProductSticker : number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'uploads/product-delete-sticker/'+idProductSticker,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //END STICKERS END-POINTS

  //SAT codes
  async getSatCodes(search : string, opc : string){
    let data = {
      search : search,
      opc : opc
    };

    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'products/get-sat-codes-product',data,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //TO DO : Implementacion Servidor
/*   async uploadImageUser(formData: FormData) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'uploads/user-image/', formData, {headers:headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if( res.error == undefined){
            console.log("error no llego nada");
            reject(res);
          }else{
            resolve(res);
          }
        },(error)=>{
          reject(error);
        },);
    });
  } */

  //TO DO : Implementacion Servidor
/*   deleteImageUser(idUser){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'uploads/user-delete-image/'+idUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  } */

  //EJEMPLO DE USO DEL METODO GET 
  /* async getRespuestas( entidad : string ) {
    return new Promise(async (resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.user.token
      })
       
      this.http.get(this.baseURL + 'user/obtener-respuestas',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    });
  } */

  //EJEMPLO DE USO DEL METODO POST 
  /* async saveRespuestas(respuestas : any){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.user.token
      });

      this.http.post(this.baseURL + 'user/save-respuestas',respuestas,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  } */
}
