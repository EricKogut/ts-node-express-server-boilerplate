import { Schema, Model, model } from "mongoose";

interface PhotoDocument {
  name: string;
  url: string;
  likes: number;
  owner: string;
  public: boolean;
}

const PhotoSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true, unique: true },
    url: { type: Schema.Types.String, required: true },
    owner: { type: Schema.Types.String, required: true },
    public: { type: Schema.Types.Boolean },
    likes: { type: Schema.Types.Number },
  },
  { timestamps: true }
);

const Photo: Model<PhotoDocument> = model<PhotoDocument>("photo", PhotoSchema);

export { PhotoDocument, Photo };
