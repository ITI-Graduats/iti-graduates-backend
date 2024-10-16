const Yup = require("yup");

const graduateValidationSchema = (branches, tracks) =>
  Yup.object()
    .shape({
      fullName: Yup.string().required("Full name is a required field."),
      personalPhoto: Yup.mixed().optional(),
      email: Yup.string()
        .matches(
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address.",
        )
        .required("Email is a required field."),
      mobile: Yup.string()
        .matches(
          /^(010|011|012|015)\d{8}$/,
          "Please enter a valid Egyptian phone number (e.g., 01012345678).",
        )
        .required("Mobile number is required."),
      cityOfBirth: Yup.string().required("City of birth is required."),
      faculty: Yup.string().required("Faculty is required."),
      university: Yup.string().required("University is required."),
      linkedin: Yup.string().url("Please enter a valid URL.").optional(),

      trackName: Yup.string()
        .when("$trackName", {
          is: () => tracks.length,
          then: (schema) => schema.oneOf(tracks),
          otherwise: (schema) => schema,
        })
        .required("Track name is required."),
      branch: Yup.string().required("Branch is required."),
      program: Yup.string()
        .oneOf(
          [
            "Professional Training Program - (9 Months)",
            "Intensive Code Camp - (4 Months)",
          ],
          "Program must be either 'Professional Training Program - (9 Months)' or 'Intensive Code Camp - (4 Months)'.",
        )
        .required("Program is required."),
      itiGraduationYear: Yup.number()
        .required("ITI graduation year is required.")
        .min(2000, "Graduation year must be after 2000.")
        .max(
          new Date().getFullYear(),
          "Graduation year must be less than or equal to the current year.",
        ),
      intake: Yup.string().required("Intake is required."),
      preferredTeachingBranches: Yup.array()
        .of(
          Yup.string().when("$preferredTeachingBranches", {
            is: () => branches.length,
            then: (schema) => schema.oneOf(branches),
            otherwise: (schema) => schema,
          }),
        )
        .min(
          1,
          "You must include at least one branch you're interested in teaching at.",
        )
        .test("uniqueness", "Duplicate branches are not allowed.", (value) => {
          if (!value || value.length === 0) return true;
          return new Set(value).size === value.length;
        })
        .required("Branches you can teach in are required."),
      preferredCoursesToTeach: Yup.string().optional(),
      isEmployed: Yup.boolean().required("Employment status is required."),

      fullJobTitle: Yup.string().test(
        "is-employed",
        "Job title is required if you are employed.",
        function (value) {
          const { isEmployed } = this.parent;
          return isEmployed ? !!value : true;
        }
      ),

      companyName: Yup.string().test(
        "is-employed",
        "Company name is required if you are employed.",
        function (value) {
          const { isEmployed } = this.parent;
          return isEmployed ? !!value : true;
        }
      ),

      yearsOfExperience: Yup.number().test(
        "is-employed",
        "Years of experience is required if you are employed.",
        function (value) {
          const { isEmployed } = this.parent;
          if (isEmployed) {
            if (value === undefined || value === null) {
              return this.createError({
                message: "Years of experience is required.",
              });
            }

            return (
              value > 0 ||
              this.createError({
                message: "Years of experience must be greater than 0.",
              })
            );
          }
          return true;
        }
      ),

      hasFreelanceExperience: Yup.boolean().required(
        "Please specify if you have worked as a freelancer before.",
      ),

      freelancingIncome: Yup.string().test(
        "has-freelance",
        "Freelance gain is required if you have freelance experience.",
        function (value) {
          const { hasFreelanceExperience } = this.parent;
          return hasFreelanceExperience ? !!value : true;
        }
      ),
      interestedInTeaching: Yup.string()
        .oneOf(
          ["Business sessions", "Courses"],
          "Please specify a valid teaching interest (either 'Business sessions' or 'Courses').",
        )
        .required("Teaching interest is required."),
    })
    .noUnknown();

const updateGraduateValidationSchema = (branches, tracks) =>
  Yup.object()
    .shape({
      fullName: Yup.string().notRequired(),
      personalPhoto: Yup.string().notRequired(),
      email: Yup.string()
        .matches(
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          "Enter a valid email",
        )
        .notRequired(),
      mobile: Yup.string()
        .matches(
          /^(010|011|012|015)\d{8}$/,
          "Please enter a valid Egyptian phone number",
        )
        .notRequired(),
      cityOfBirth: Yup.string().notRequired(),
      faculty: Yup.string().notRequired(),
      university: Yup.string().notRequired(),
      trackName: Yup.string()
        .when("$trackName", {
          is: () => tracks.length,
          then: (schema) => schema.oneOf(tracks),
          otherwise: (schema) => schema,
        })
        .notRequired(),
      branch: Yup.string().notRequired(),
      program: Yup.string()
        .oneOf(
          [
            "Professional Training Program - (9 Months)",
            "Intensive Code Camp - (4 Months)",
          ],
          "Program must be either Professional Training Program - (9 Months) or Intensive Code Camp - (4 Months).",
        )
        .notRequired(),
      itiGraduationYear: Yup.number()
        .notRequired()
        .min(2000, "Year must be after 2000")
        .max(
          new Date().getFullYear(),
          "Year must be less than or equal to the current year",
        ),
      intake: Yup.string().notRequired(),
      preferredTeachingBranches: Yup.array()
        .of(
          Yup.string().when("$preferredTeachingBranches", {
            is: () => branches.length,
            then: (schema) => schema.oneOf(branches),
            otherwise: (schema) => schema,
          }),
        )
        .min(
          1,
          "you have to include at least one branch you're interested to teach in!",
        )
        .test(
          "uniqueness",
          "preferredTeachingBranches duplication isn't allowed!",
          (value) => {
            if (!value || value.length === 0) return true;
            return new Set(value).size === value.length;
          },
        )
        .notRequired(),
      preferredCoursesToTeach: Yup.string().notRequired(),
      fullJobTitle: Yup.string().notRequired(),
      companyName: Yup.string().notRequired(),
      yearsOfExperience: Yup.number().optional(),
      hasFreelanceExperience: Yup.boolean().notRequired(),
      interestedInTeaching: Yup.string()
        .oneOf(
          ["Business sessions", "Courses"],
          "Please specify a valid teaching interest",
        )
        .notRequired(),
    })
    .noUnknown();

module.exports = {
  graduateValidationSchema,
  updateGraduateValidationSchema,
};
