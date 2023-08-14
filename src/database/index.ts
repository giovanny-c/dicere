import "reflect-metadata"
import {DataSource} from "typeorm"
import "dotenv/config"

export const dataSource: DataSource = new DataSource({

    type: "postgres",
    host: process.env.PRODUCTION ? process.env.DB_HOST : "localhost",
    port: process.env.PROCUCTION ? +(process.env.DB_MASK_PORT) : +(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [
        process.env.PRODUCTION? process.env.DB_ENTITIES : "./src/modules/**/entities/*.ts"
    ],
    migrations: [
        process.env.PRODUCTION? process.env.DB_MIGRATIONS : "./src/database/migrations/*.ts"
    ],

})

dataSource.initialize()