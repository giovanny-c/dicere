import { Repository } from "typeorm";
import { ICreateUser, IFindUser } from "../../dtos/IUsersDTOs";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";
import { dataSource } from "../../../../database";
import { query } from "express";


class UserRepository implements IUsersRepository{
    
    private repository: Repository<User>

    constructor(){
        this.repository = dataSource.getRepository(User)
    }

   

    
    async save({admin, email, name, id, password_hash, salt}: ICreateUser): Promise<User> {
       
            const user = this.repository.create({
                id,
                name,
                email,
                admin, 
                password_hash,
                salt
            })

            return await this.repository.save(user)

    }
    async findBy({admin, email, id, name, limit, offset}: Partial<IFindUser>): Promise<User[]> {
        
        //deve achar apenas pelos parametros que forem enviados
        let query = await this.repository.createQueryBuilder("users")
        .select("users")

        if(id){
            query.andWhere("users.id = :id", {id})
        }

        if(name){
            query.andWhere("users.name ilike :name", {name: `%${name}%`})
        }

        if(email){
            query.andWhere("users.email ilike :email", {email: `%${email}%`})
        }

        if(typeof admin === "boolean"){
            query.andWhere("users.admin = :admin", {admin})
        }

        if(limit){
            query.limit(limit)
        }
        if(offset){
            query.offset(offset)
        }



        return await query.getMany()
    }

    async findByNameOrEmail({email, name}: Partial<Pick<IFindUser, "email" | "name">>): Promise<User> {
        
        const query = await this.repository.createQueryBuilder("users")
        .select("users")

        if(email){
            query.orWhere("email = :email", {email})
        }

        if(name){
            query.orWhere("name = :name", {name})
        }

        return await query.getOne()
    }

    async findById({id}: Pick<IFindUser, "id">): Promise<User> {

        const user = await this.repository.findOne({
            where: {id}
        })
        
        return user
    }

}

export{UserRepository}