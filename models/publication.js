import { model, Schema } from "mongoose";

const PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: "User"},
    text: { type: String,required:true},
    file: {type:String}},
    {
      timestamps: true,
      versionKey: false,
    }
)

const Publication = model("Publication", PublicationSchema, "publications");

export { Publication };
