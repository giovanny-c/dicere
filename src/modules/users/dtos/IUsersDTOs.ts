
interface ICreateUser {
    id?: string
    name: string
    password_hash?: string
    salt?: string
    admin: boolean
    email: string

}

interface IFindUser {
    id: string,
    name: string,
    email: string
    admin: boolean
    limit: number
    offset: number
}

export { ICreateUser, IFindUser}