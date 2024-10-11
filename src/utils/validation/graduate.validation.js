const Yup = require("yup");

const graduateValidationSchema = Yup.object()
    .shape({
        fullName: Yup.string().required("fullName is a required field!!"),
        personalPhoto: Yup.string().optional(),
        email: Yup.string()
            .matches(
                /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                "Enter a valid email"
            )
            .required("email is a required field!!"),
        mobile: Yup.string()
            .matches(
                /^(010|011|012|015)\d{8}$/,
                "Please enter a valid Egyptian phone number"
            )
            .required("Mobile is required"),
        cityOfBirthplace: Yup.string().required(
            "City of Birthplace is required"
        ),
        faculty: Yup.string().required("Faculty is required"),
        university: Yup.string().required("University is required"),
        trackName: Yup.string().required("Track Name is required"),
        branch: Yup.string().required("Branch is required"),
        program: Yup.string()
            .oneOf(["9M", "4M"], "Program must be either 9M or 4M")
            .required("Program is required"),
        graduationYearFromIti: Yup.number()
            .required("Graduation Year from ITI is required")
            .min(2000, "Year must be after 2000")
            .max(
                new Date().getFullYear(),
                "Year must be less than or equal to the current year"
            ),
        intake: Yup.string().required("Intake is required"),
        branchesYouCanTeachIn: Yup.array().of(Yup.string()).optional(),
        preferredCoursesToTeach: Yup.string().optional(),
        fullJobTitle: Yup.string().optional(),
        companyName: Yup.string().optional(),
        yearsOfExperience: Yup.number().optional(),
        workedAsFreelancerBefore: Yup.boolean().required(
            "Please specify if you have worked as a freelancer before"
        ),
        interestedInTeaching: Yup.string()
            .oneOf(
                ["Business sessions", "Courses"],
                "Please specify a valid teaching interest"
            )
            .required("This field is required"),
    })
    .noUnknown();

const updateGraduateValidationSchema = Yup.object()
    .shape({
        fullName: Yup.string().notRequired(),
        personalPhoto: Yup.string().notRequired(),
        email: Yup.string()
            .matches(
                /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                "Enter a valid email"
            )
            .notRequired(),
        mobile: Yup.string()
            .matches(
                /^(010|011|012|015)\d{8}$/,
                "Please enter a valid Egyptian phone number"
            )
            .notRequired(),
        cityOfBirthplace: Yup.string().notRequired(),
        faculty: Yup.string().notRequired(),
        university: Yup.string().notRequired(),
        trackName: Yup.string().notRequired(),
        branch: Yup.string().notRequired(),
        program: Yup.string()
            .oneOf(["9M", "4M"], "Program must be either 9M or 4M")
            .notRequired(),
        graduationYearFromIti: Yup.number()
            .notRequired()
            .min(2000, "Year must be after 2000")
            .max(
                new Date().getFullYear(),
                "Year must be less than or equal to the current year"
            ),
        intake: Yup.string().notRequired(),
        branchesYouCanTeachIn: Yup.array().of(Yup.string()).notRequired(),
        preferredCoursesToTeach: Yup.string().notRequired(),
        fullJobTitle: Yup.string().notRequired(),
        companyName: Yup.string().notRequired(),
        yearsOfExperience: Yup.number().optional(),
        workedAsFreelancerBefore: Yup.boolean().notRequired(),
        workedAsFreelancerBefore: Yup.boolean().notRequired(),
        interestedInTeaching: Yup.string()
            .oneOf(
                ["Business sessions", "Courses"],
                "Please specify a valid teaching interest"
            )
            .notRequired(),
    })
    .noUnknown();

module.exports = {
    graduateValidationSchema,
    updateGraduateValidationSchema,
};
