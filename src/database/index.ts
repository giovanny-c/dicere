import "reflect-metadata"
import {DataSource} from "typeorm"
import "dotenv/config"

export const dataSource: DataSource = new DataSource({

    type: "postgres",
    host: process.env.PRODUCTION ? process.env.DB_HOST : "database",
    port: process.env.PROCUCTION ? +(process.env.DB_MASK_PORT) : +(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,

    entities: [
        process.env.PRODUCTION? process.env.DB_ENTITIES : "./src/modules/**/entities/*.ts"
    ],
    migrations: [
        process.env.PRODUCTION? process.env.DB_MIGRATIONS : "./src/database/migrations/*.ts"
    ],

})

dataSource.initialize()