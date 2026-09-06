import { celebrate, Joi } from 'celebrate';

export default celebrate({ params: { uid: Joi.string().required() } });
