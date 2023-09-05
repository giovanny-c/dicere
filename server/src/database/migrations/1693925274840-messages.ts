import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Messages1693925274840 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({

            name: "messages",
            
            columns: [

                {
                    name: "conversation_id",
                    type: "varchar"

                },
                {
                    name: "messages",
                    type: "varchar[]"
                }
            ]

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("messages")
    }

}
