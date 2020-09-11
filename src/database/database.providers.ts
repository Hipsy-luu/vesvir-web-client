import { Sequelize } from 'sequelize-typescript';

/**
 * SEQUELIZE variable is stored in a file named
 * 'constants' so it can be easily reused anywhere
 * without being subject to human error.
 */
//import { SEQUELIZE } from '../utils/constants';
import { User } from '../models/users.entity';

export const databaseProviders = [
  {
    provide: 'SequelizeInstance',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        define: {
          timestamps: false,
        },
        logging: false,
        host: 'localhost',
        port: 3306,
        username: 'vesvir_user',
        password: 'hPjdnv5yJW2naLol',
        database: 'vesvir_db',
      });

      /**
       * Add Models Here
       * ===============
       * You can add the models to
       * Sequelize later on.
       */
      sequelize.addModels([
        User,
      ]);

      await sequelize.sync();

      return sequelize;
    },
  },
];
