import mongoose from "mongoose";

const dataSchema = mongoose.Schema({
  data: []
});

export default mongoose.model("dataCollection", dataSchema);
