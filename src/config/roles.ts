import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['getConversations', 'getMessages'],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'getConversations', 'manageConversations', 'getMessages', 'manageMessages']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
