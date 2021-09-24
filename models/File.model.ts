import { Schema, Model, model } from "mongoose";

interface FileDocument {
  name: string;
  privateName: string;
  url: string;
  location: string;
  owner: string;
  public: boolean;
}

const FileSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true, unique: false },
    privateName: { type: Schema.Types.String, required: false, unique: true },
    url: { type: Schema.Types.String, required: true },
    location: { type: Schema.Types.String, required: true },
    owner: { type: Schema.Types.String, required: true },
    public: { type: Schema.Types.Boolean },
  },
  { timestamps: true }
);

const File: Model<FileDocument> = model<FileDocument>("file", FileSchema);

export { FileDocument, File };
