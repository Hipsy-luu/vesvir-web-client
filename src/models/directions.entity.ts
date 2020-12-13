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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import sequelize = require('sequelize');

import { User } from './users.entity';

@Table({
  tableName: 'directions',
  timestamps: false
})
export class Direction extends Model<Direction> {
  //Ejemplo
  /* @Column({
    type: DataType.BOOLEAN, DataType.INTEGER({ length: 11 }), DataType.STRING(45), DataType.DATE,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    defaultValue: false,
    field: 'have_image',
  })
  haveImage: string; */

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'idDirection',
  })
  public idDirection: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'name',
  })
  public name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'surnames',
  })
  public surnames: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'phone',
  })
  public phone: string;

  @Column({
    type: DataType.STRING(800),
    allowNull: false,
    field: 'street',
  })
  public street: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'number',
  })
  public number: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: "",
    field: 'extNumber',
  })
  public extNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'state',
  })
  public state: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'city',
  })
  public city: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'postalCode',
  })
  public postalCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'colony',
  })
  public colony: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'default',
  })
  public default: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'deleted',
  })
  public deleted: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    defaultValue: false,
    field: 'idUser',
  })
  public idUser: string;

  @BelongsTo(() => User, 'idUser')
  user: User;

}
