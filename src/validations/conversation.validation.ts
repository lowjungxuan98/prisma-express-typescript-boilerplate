import Joi from 'joi';

const createConversation = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required()
  })
};

const getConversations = {
  query: Joi.object().keys({
    userId: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getConversation = {
  params: Joi.object().keys({
    conversationId: Joi.number().integer()
  })
};

const updateConversation = {
  params: Joi.object().keys({
    conversationId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      userId: Joi.number().integer()
    })
    .min(1)
};

const deleteConversation = {
  params: Joi.object().keys({
    conversationId: Joi.number().integer()
  })
};

export default {
  createConversation,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation
}; 