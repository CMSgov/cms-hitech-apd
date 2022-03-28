import Joi from 'joi';

const personCostSchema = Joi.object().pattern(
    /\d{4}/,
    Joi.object({
      amt: Joi.number().positive().required().messages({
        'number.empty': 'Provide a cost.',
        'number.format': 'Provide a valid amount.',
        'number.positive':
          'Provide an amount greater than or equal to 0.'
      }),
      perc: Joi.number().positive().greater(0).required().messages({
        'number.empty': 'Provide number of FTEs.',
        'number.positive': 'Provide a number greater than 0.',
        'number.greater': 'Provide a number greater than 0.'
      })
  })
);

export default personCostSchema;