export class Category {
    idCategory: number;
    name: string;
    genre: number;
    noProducts : number;
    active: boolean;
    deleted : boolean;
    createDate : Date;

    constructor() {
        this.idCategory = -1;
        this.name = "";
        this.genre = -1;
        this.noProducts = 0;
        this.active = false;
        this.deleted = false;
        this.createDate = new Date();
    }
}

