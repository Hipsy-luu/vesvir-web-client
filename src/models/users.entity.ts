//import { Sequelize, DataType } from 'sequelize';
import * as bcrypt from 'bcrypt';

import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  HasMany,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'id_user',
  })
  public idUser: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    defaultValue: 0,
  })
  public role: number;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'have_image',
  })
  haveImage: boolean;

  @BeforeCreate
  public static async hashPassword(user: User) {
    // Generate a salt and use it to hash the user's password
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
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
}
