import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableUser1691678342373 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",

            columns:[
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "email",
                    type: "varchar",
                    
                },
                {
                    name: "password_hash",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "salt",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "admin",
                    type: "boolean",
                    default: false
                }


            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }

}
