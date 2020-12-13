import { Card } from './cards.entity';
//import { Sequelize, DataType } from 'sequelize';
import * as bcrypt from 'bcrypt';

import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  HasMany,
  CreatedAt,
} from 'sequelize-typescript';
//import * as sequelize from 'sequelize'; // Este import tiene las operaciones extra que se pueden hacer para personalizar las consultas por ejemplo
import { Direction } from './directions.entity';
import { Product } from './products.entity';

@Table({
  tableName: 'users',
  timestamps: false
})
export class User extends Model<User> {
  //Ejemplo
  /* @Column({
    type: DataType.BOOLEAN, DataType.INTEGER({ length: 11 }), DataType.STRING(45), DataType.DATE,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    defaultValue: false,
    validate: { // DOC : https://sequelize.org/master/manual/validations-and-constraints.html
      notEmpty: {
        msg: 'Please enter your name'
      }
    }
    field: 'have_image',
    
  })
  haveImage: string; */

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'idUser',
  })
  public idUser: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'name',
  })
  name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    defaultValue: "",
    field: 'surnames',
  })
  surnames: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    unique: true,
    field: 'email',
  })
  email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'password',
  })
  password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'passwordF',
  })
  passwordF: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    /* defaultValue: sequelize.fn('current_timestamp'), */
    defaultValue: new Date(),
    field: 'birthDay',
  })
  birthDay: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'phone',
  })
  phone: string;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: -1,
    field: 'genre',
  })
  gender: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: -1,
    field: 'actualPreference',
  })
  actualPreference: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: -1,
    field: 'userType',
  })
  userType: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(),
    field: 'createDate',
  })
  createDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(),
    field: 'lastLogin',
  })
  lastLogin: Date;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    defaultValue: "",
    field: 'businessName',
  })
  businessName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'rfc',
  })
  rfc: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'phoneBilling',
  })
  phoneBilling: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: "",
    field: 'emailBilling',
  })
  emailBilling: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'state',
  })
  state: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'city',
  })
  city: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'postalCode',
  })
  postalCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'colony',
  })
  colony: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: true,
    defaultValue: "",
    field: 'street',
  })
  street: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'number',
  })
  number: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'deleted',
  })
  deleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'active',
  })
  active: boolean;
  
  @Column({
    type: DataType.STRING(300),
    allowNull: true,
    defaultValue: "",
    field: 'conektaClientId',
  })
  conektaClientId: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    defaultValue: "",
    field: 'userFacebookImage',
  })
  userFacebookImage : string;

  @HasMany(() => Card, 'idUser')
  cards: Card[];
  
  @HasMany(() => Direction, 'idUser')
  directions: Direction[];

  @HasMany(() => Product, 'idProvider')
  products: Product[];

  @BeforeCreate
  public static async hashPassword(user: User) {
    // Generate a salt and use it to hash the user's password
    if(user.password.length != 0){
      user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
    }
    if(user.passwordF.length != 0){
      user.passwordF = await bcrypt.hash(user.passwordF, bcrypt.genSaltSync(10));
    }
    //a partir de aqui se hacen las acciones posteriores
  }

  public async validPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  public async hashNewPassword(newPassword: string) {
    // Generate a salt and use it to hash the user's password
    return await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));
    //a partir de aqui se hacen las acciones posteriores
  }

  public async generatePassword() {
    // Start. Create Automatic Password 
    var length = 8;
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
}
}
