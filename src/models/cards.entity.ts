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
  tableName: 'cards',
  timestamps: false
})
export class Card extends Model<Card> {
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
    field: 'idCard',
  })
  public idCard: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    defaultValue: false,
    field: 'idUser',
  })
  public idUser: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
    field: 'token',
  })
  public token: string;

  @Column({
    type: DataType.STRING(4),
    allowNull: false,
    field: 'lastFour',
  })
  public lastFour: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'brand',
  })
  public brand: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(),
    field: 'createdAt',
  })
  createdAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'deleted',
  })
  public deleted: boolean;

  @BelongsTo(() => User, 'idUser')
  user: User;
}
