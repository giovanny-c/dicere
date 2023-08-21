import "reflect-metadata"
import {DataSource} from "typeorm"
import "dotenv/config"

const {
    PRODUCTION,
    DB_HOST,
    DB_MASK_PORT,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    DB_ENTITIES,
    DB_MIGRATIONS,
} = process.env

export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: PRODUCTION ? DB_HOST : "dicere_database",
    port: PRODUCTION ? +(DB_MASK_PORT) : +(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,

    entities:[
        PRODUCTION ? DB_ENTITIES : "./src/modules/**/entities/*.ts"
    ],
    migrations:[
        PRODUCTION ? DB_MIGRATIONS : "./src/database/migrations/*.ts"

    ]
})

dataSource.initialize().then(()=> console.log("connected to dicere_database"))