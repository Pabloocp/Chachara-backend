import { model, Schema } from "mongoose";

const FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: "User"},
    followed: { type: Schema.ObjectId, ref: "User"}},
    {
      timestamps: true,
      versionKey: false,
    }
)

const Follow = model("Follow", FollowSchema, "follows");

export { Follow };
