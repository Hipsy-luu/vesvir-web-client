import { SafeUrl } from '@angular/platform-browser';

export class Brand {
    idBrand: number;
    name: string;
    noProducts : number;
    active: boolean;
    deleted : boolean;
    haveImage : boolean;
    imageBlob: SafeUrl;
    createDate : Date;

    constructor() {
        this.idBrand = -1;
        this.name = "";
        this.noProducts = 0;
        this.active = false;
        this.deleted = false;
        this.haveImage = false;
        this.imageBlob = "";
        this.createDate = new Date();
    }
}

