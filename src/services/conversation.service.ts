import { Conversation, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Create a conversation
 * @param {number} userId
 * @returns {Promise<Conversation>}
 */
const createConversation = async (userId: number): Promise<Conversation> => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  
  return prisma.conversation.create({
    data: {
      userId
    }
  });
};

/**
 * Query for conversations
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryConversations = async <Key extends keyof Conversation>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'userId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Conversation, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  
  const conversations = await prisma.conversation.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  
  return conversations as Pick<Conversation, Key>[];
};

/**
 * Get conversation by id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Conversation, Key> | null>}
 */
const getConversationById = async <Key extends keyof Conversation>(
  id: number,
  keys: Key[] = [
    'id',
    'userId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Conversation, Key> | null> => {
  return prisma.conversation.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Conversation, Key> | null>;
};

/**
 * Get conversations by userId
 * @param {number} userId
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Conversation, Key>[]>}
 */
const getConversationsByUserId = async <Key extends keyof Conversation>(
  userId: number,
  keys: Key[] = [
    'id',
    'userId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Conversation, Key>[]> => {
  return prisma.conversation.findMany({
    where: { userId },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Conversation, Key>[]>;
};

/**
 * Update conversation by id
 * @param {number} conversationId
 * @param {Object} updateBody
 * @returns {Promise<Conversation>}
 */
const updateConversationById = async <Key extends keyof Conversation>(
  conversationId: number,
  updateBody: Prisma.ConversationUpdateInput,
  keys: Key[] = ['id', 'userId', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Conversation, Key> | null> => {
  const conversation = await getConversationById(conversationId, ['id']);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  const updatedConversation = await prisma.conversation.update({
    where: { id: conversation.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  
  return updatedConversation as Pick<Conversation, Key> | null;
};

/**
 * Delete conversation by id
 * @param {number} conversationId
 * @returns {Promise<Conversation>}
 */
const deleteConversationById = async (conversationId: number): Promise<Conversation> => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  // Delete all messages in the conversation first
  await prisma.message.deleteMany({
    where: { conversationId }
  });
  
  // Then delete the conversation
  await prisma.conversation.delete({ 
    where: { id: conversation.id } 
  });
  
  return conversation;
};

export default {
  createConversation,
  queryConversations,
  getConversationById,
  getConversationsByUserId,
  updateConversationById,
  deleteConversationById
}; 