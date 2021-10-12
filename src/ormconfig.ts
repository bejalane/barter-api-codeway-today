import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};
