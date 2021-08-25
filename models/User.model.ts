import { Schema, Model, model } from "mongoose";

interface UserDocument {
  username: string;
  password: string;
  salt: string;
  email: string;
  bio: string;
  picture: string;
}

const UserSchema = new Schema(
  {
    username: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    bio: Schema.Types.String,
    picture: Schema.Types.String,
  },
  { timestamps: true }
);

const User: Model<UserDocument> = model<UserDocument>("user", UserSchema);

export { UserDocument, User };
