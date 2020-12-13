import { Category } from './categories.entity';
//import { Sequelize, DataType } from 'sequelize';

import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  HasMany,
  HasOne,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
//import * as sequelize from 'sequelize'; // Este import tiene las operaciones extra que se pueden hacer para personalizar las consultas por ejemplo
import { Direction } from './directions.entity';
import { User } from './users.entity';
import { Brand } from './brands.entity';
import { Quantity } from './quantitys.entity';
import { ProductImage } from './productImages.entity';
import { ProductStickers } from './productStickers.entity';

@Table({
  tableName: 'products',
  timestamps: false
})
export class Product extends Model<Product> {
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
    field: 'idProduct',
  })
  public idProduct: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'idProvider',
  })
  public idProvider: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'activated',
  })
  public activated: boolean;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'name',
  })
  public name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'referenceCode',
  })
  public referenceCode: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'barCode',
  })
  public barCode: string;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'idBrand',
  })
  public idBrand: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'gender',
  })
  public gender: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'idCategory',
  })
  public idCategory: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'material',
  })
  public material: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
    field: 'shortDescription',
  })
  public shortDescription: string;

  @Column({
    type: DataType.STRING(5000),
    allowNull: false,
    field: 'description',
  })
  public description: string;

  @Column({
    type: DataType.STRING(5000),
    allowNull: false,
    field: 'specs',
  })
  public specs: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    field: 'price',
  })
  public price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    field: 'width',
  })
  public width: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    field: 'height',
  })
  public height: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    field: 'depth',
  })
  public depth: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    field: 'weight',
  })
  public weight: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'deleted',
  })
  public deleted: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(),
    field: 'createDate',
  })
  createDate: Date;

  @BelongsTo(() => User, 'idProvider')
  provider: User;

  @BelongsTo(() => Brand, 'idBrand')
  brand: Brand;

  @BelongsTo(() => Category, 'idCategory')
  category: Category;

  @HasMany(() => Quantity, 'idProduct')
  quantities: Quantity[];

  @HasMany(() => ProductImage, 'idProduct')
  images: ProductImage[];

  @HasMany(() => ProductStickers, 'idProduct')
  stickers: ProductStickers[];
}
