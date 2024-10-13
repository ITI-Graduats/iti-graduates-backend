const Yup = require("yup");

const trackValidationSchema = Yup.object()
  .shape({
    name: Yup.string().min(2).required("Track name is a required field!!"),
    description: Yup.string().min(2).max(500).notRequired(),
    isActive: Yup.boolean().notRequired(),
  })
  .noUnknown();

const updateTrackValidationSchema = Yup.object()
  .shape({
    name: Yup.string().min(2).notRequired(),
    description: Yup.string().min(2).max(500).notRequired(),
    isActive: Yup.boolean().notRequired(),
  })
  .noUnknown();

module.exports = {
  trackValidationSchema,
  updateTrackValidationSchema,
};
