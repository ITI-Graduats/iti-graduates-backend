const { Schema, model } = require("mongoose");
const { hash } = require("bcrypt");

const graduateSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    personalPhoto: {
      type: String,
      optional: true,
    },
    mobile: {
      type: String,
      required: true,
      match: [
        /^(010|011|012|015)\d{8}$/,
        "Please enter a valid Egyptian phone number",
      ],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill with a valid email address",
      ],
    },
    cityOfBirthplace: {
      type: String,
      required: [true, "City of Birthplace is required"],
    },
    faculty: {
      type: String,
      required: [true, "Faculty is required"],
    },
    university: {
      type: String,
      required: [true, "University is required"],
    },
    trackName: {
      type: String,
      required: [true, "Track Name is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
    program: {
      type: String,
      required: [true, "Program is required"],
      enum: ["9M", "4M"],
    },
    graduationYearFromIti: {
      type: Number,
      required: [true, "Graduation Year from ITI is required"],
    },
    intake: {
      type: String,
      required: [true, "Intake is required"],
    },
    branchesYouCanTeachIn: {
      type: [String],
      optional: true,
    },
    preferredCoursesToTeach: {
      type: String,
      optional: true,
    },
    fullJobTitle: {
      type: String,
      optional: true,
    },
    companyName: {
      type: String,
      optional: true,
    },
    yearsOfExperience: {
      type: Number,
      optional: true,
    },
    workedAsFreelancerBefore: {
      type: Boolean,
      required: true,
    },
    interestedInTeaching: {
      type: String,
      enum: ["Business sessions", "Courses"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        delete ret.createdAt;
      },
    },
  }
);

const Graduate = model("Graduate", graduateSchema);

module.exports = Graduate;
