import Joi from 'joi';

const createMessage = {
  body: Joi.object().keys({
    conversationId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
    messageText: Joi.string().required()
  })
};

const getMessages = {
  query: Joi.object().keys({
    conversationId: Joi.number().integer(),
    userId: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getMessage = {
  params: Joi.object().keys({
    messageId: Joi.number().integer()
  })
};

const updateMessage = {
  params: Joi.object().keys({
    messageId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      messageText: Joi.string()
    })
    .min(1)
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.number().integer()
  })
};

export default {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage
}; 