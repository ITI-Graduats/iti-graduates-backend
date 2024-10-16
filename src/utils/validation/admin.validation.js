const Yup = require("yup");

const loginAdminValidationSchema = Yup.object()
  .shape({
    email: Yup.string()
      .matches(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email")
      .required("email is a required field!!"),
    password: Yup.string()
      .min(8)
      .max(20)
      .required("password is a required field!!"),
  })
  .noUnknown();

const createAdminValidationSchema = (branches) =>
  Yup.object()
    .shape({
      fullName: Yup.string().required("fullName is a required field!!"),
      branch: Yup.string()
        .when("$branch", {
          is: () => branches.length,
          then: (schema) => schema.oneOf(branches),
          otherwise: (schema) => schema,
        })
        .required("branch is a required field!!"),
      email: Yup.string()
        .matches(
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          "Enter a valid email",
        )
        .required("email is a required field!!"),
      password: Yup.string()
        .min(8)
        .max(20)
        .required("password is a required field"),
    })
    .noUnknown();

const updateAdminValidationSchema = (branches) =>
  Yup.object()
    .shape({
      fullName: Yup.string().notRequired(),
      branch: Yup.string()
        .when("$branch", {
          is: () => branches.length,
          then: (schema) => schema.oneOf(branches),
          otherwise: (schema) => schema,
        })
        .notRequired(),
      email: Yup.string()
        .matches(
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          "Enter a valid email",
        )
        .notRequired(),
      password: Yup.string().min(8).max(20).notRequired(),
    })
    .noUnknown();

module.exports = {
  loginAdminValidationSchema,
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
