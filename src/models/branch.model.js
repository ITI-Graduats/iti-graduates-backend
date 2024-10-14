const { Schema, model } = require("mongoose");

const branchSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        delete ret.createdAt;
      },
    },
  },
);

const Branch = model("Branch", branchSchema);

module.exports = Branch;
