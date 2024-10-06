const Yup = require("yup");

const trackValidationSchema = Yup.object()
  .shape({
    name: Yup.string().min(3).required("Track name is a required field!!"),
    description: Yup.string()
      .min(8)
      .max(500)
      .required("Track description is a required field!!"),
    isActive: Yup.boolean().notRequired(),
  })
  .noUnknown();

const updateTrackValidationSchema = Yup.object()
  .shape({
    name: Yup.string().min(3),
    description: Yup.string().min(8).max(500),
    isActive: Yup.boolean(),
  })
  .noUnknown();

module.exports = {
  trackValidationSchema,
  updateTrackValidationSchema,
};
