const Joi = require("joi");

const createRecordSchema = Joi.object({
  color: Joi.string().required(),
  name: Joi.string().min(3).max(30).required(),
  length: Joi.number().required(),
  height: Joi.number().required(),
  weight: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  stackable: Joi.boolean(),
  tiltable: Joi.boolean(),
});

const updateRecordSchema = Joi.object({
  id: Joi.string().required(),
  color: Joi.string().required(),
  name: Joi.string().min(3).max(30).required(),
  length: Joi.number().required(),
  height: Joi.number().required(),
  weight: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  stackable: Joi.boolean(),
  tiltable: Joi.boolean(),
});

const deleteRecordSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  deleteRecordSchema,
};