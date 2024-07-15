import { model, Schema } from "mongoose";

const schema = Schema({
  name: String,
  date: { type: Date, default: Date.now },
  content: String,
});

const Document = model("Document", schema);

export { Document };
