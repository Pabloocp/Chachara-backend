import { model, Schema } from "mongoose";

import bcrypt from "bcrypt";

let userchema = new Schema(
  {
    _id: { type: Schema.ObjectId, auto: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    nick: { type: String, required: true, unique: true },
    bio: {type : String},
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minLength: 8,
    },
    rol: { type: String, required: true, trim: true, default: "user" },
    image: { type: String, default: "defualt.png" },
    my_circle: { type: [String], default: [], required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userchema.pre("save", async function (next) {
  const user = this;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

const User = model("User", userchema);

export { User };
