const Yup = require("yup");

const branchValidationSchema = Yup.object()
  .shape({
    name: Yup.string().min(3).required("Branch name is a required field!!"),
    location: Yup.string().min(3).required("Branch location is a required field!!"),
    isActive: Yup.boolean().notRequired(),
  })
  .noUnknown();

const updateBranchValidationSchema = Yup.object()
  .shape({
    name: Yup.string().min(3),
    location: Yup.string().min(3),
    isActive: Yup.boolean(),
  })
  .noUnknown();

module.exports = {
  branchValidationSchema,
  updateBranchValidationSchema,
};
