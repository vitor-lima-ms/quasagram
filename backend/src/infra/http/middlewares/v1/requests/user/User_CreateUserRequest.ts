import { celebrate, Joi } from 'celebrate';

export default celebrate({
  body: {
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,4096}$/)
      .required(),
    displayName: Joi.string(),
    phoneNumber: Joi.string().regex(/^\+[1-9]\d{1,14}$/),
  },
});
