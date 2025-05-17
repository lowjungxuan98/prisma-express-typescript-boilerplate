import { Message, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Create a message
 * @param {number} conversationId
 * @param {number} userId
 * @param {string} messageText
 * @returns {Promise<Message>}
 */
const createMessage = async (
  conversationId: number,
  userId: number,
  messageText: string
): Promise<Message> => {
  // Check if conversation exists
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  
  if (!conversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
  }
  
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  
  return prisma.message.create({
    data: {
      conversationId,
      userId,
      messageText
    }
  });
};

/**
 * Query for messages
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async <Key extends keyof Message>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'conversationId',
    'userId',
    'messageText',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Message, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  
  const messages = await prisma.message.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  
  return messages as Pick<Message, Key>[];
};

/**
 * Get message by id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Message, Key> | null>}
 */
const getMessageById = async <Key extends keyof Message>(
  id: number,
  keys: Key[] = [
    'id',
    'conversationId',
    'userId',
    'messageText',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Message, Key> | null> => {
  return prisma.message.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Message, Key> | null>;
};

/**
 * Get messages by conversationId
 * @param {number} conversationId
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Message, Key>[]>}
 */
const getMessagesByConversationId = async <Key extends keyof Message>(
  conversationId: number,
  keys: Key[] = [
    'id',
    'conversationId',
    'userId',
    'messageText',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Message, Key>[]> => {
  return prisma.message.findMany({
    where: { conversationId },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    orderBy: { createdAt: 'asc' }
  }) as Promise<Pick<Message, Key>[]>;
};

/**
 * Update message by id
 * @param {number} messageId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateMessageById = async <Key extends keyof Message>(
  messageId: number,
  updateBody: Prisma.MessageUpdateInput,
  keys: Key[] = [
    'id',
    'conversationId',
    'userId',
    'messageText',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Message, Key> | null> => {
  const message = await getMessageById(messageId, ['id']);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  
  const updatedMessage = await prisma.message.update({
    where: { id: message.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  
  return updatedMessage as Pick<Message, Key> | null;
};

/**
 * Delete message by id
 * @param {number} messageId
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (messageId: number): Promise<Message> => {
  const message = await getMessageById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  
  await prisma.message.delete({ 
    where: { id: message.id } 
  });
  
  return message;
};

export default {
  createMessage,
  queryMessages,
  getMessageById,
  getMessagesByConversationId,
  updateMessageById,
  deleteMessageById
}; 