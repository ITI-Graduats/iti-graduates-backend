const { Schema, model } = require("mongoose");

const graduateSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    personalPhoto: {
      type: String,
      default: null,
    },
    personalPhotoFileId: {
      type: String,
      default: null,
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
    cityOfBirth: {
      type: String,
      required: [true, "City of Birth is required"],
    },
    faculty: {
      type: String,
      required: [true, "Faculty is required"],
    },
    university: {
      type: String,
      required: [true, "University is required"],
    },
    linkedin: {
      type: String,
      default: null,
    },
    isEmployed: {
      type: Boolean,
      required: [true, "Eployment status is required"],
    },
    freelancingIncome: {
      type: String,
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
      enum: [
        "Professional Training Program - (9 Months)",
        "Intensive Code Camp - (4 Months)",
      ],
    },
    itiGraduationYear: {
      type: Number,
      required: [true, "Graduation Year from ITI is required"],
    },
    intake: {
      type: String,
      required: [true, "Intake is required"],
    },
    preferredTeachingBranches: {
      type: [String],
      required: true,
    },
    preferredCoursesToTeach: {
      type: String,
      default: null,
    },
    fullJobTitle: {
      type: String,
      default: null,
    },
    companyName: {
      type: String,
      default: null,
    },
    yearsOfExperience: {
      type: Number,
      default: null,
    },
    hasFreelanceExperience: {
      type: Boolean,
      required: true,
    },
    interestedInTeaching: {
      type: String,
      enum: ["Business sessions", "Courses", "Both"],
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
