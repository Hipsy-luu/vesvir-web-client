export class UserClass {
  idUser: number;
  name: string;
  email: string;
  password: string;
  type: number;
  username: string;
  role: number;
  description : string;
  haveImage: boolean;

  constructor() {}

  init(
    id: number,
    nam: string,
    em: string,
    pass: string,
    ty: number,
    user: string,
    image: boolean,
  ) {
    this.idUser = id;
    this.name = nam;
    this.email = em;
    this.password = pass;
    this.type = ty;
    this.username = user;
    this.role = 0;
    this.haveImage = image;
  }
}
