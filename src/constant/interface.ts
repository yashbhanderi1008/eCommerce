import { Types, Document } from "mongoose"

export interface userInterface extends Document {
    _id?: Types.ObjectId
    userName: string
    password: string
}

export interface profileInterface extends Document {
    _id?: Types.ObjectId
    profileName: string
    relationToUser: string
    userId: Types.ObjectId
}

export interface productInterface extends Document {
    _id?: Types.ObjectId,
    productName: string,
    category: string,
    price: number
}

export interface itemCollectionInterface {
    productId: Types.ObjectId,
    quantity: number
}

export interface cartInterface extends Document {
    itemCollection: itemCollectionInterface[],
    profileId: Types.ObjectId
}
