export const AUTH_RABBITMQ_CLIENT = "AUTH_RABBITMQ_CLIENT";
export const USERS_RABBITMQ_CLIENT = "USERS_RABBITMQ_CLIENT";
export const WORKSPACE_RABBITMQ_CLIENT = "WORKSPACE_RABBITMQ_CLIENT";
export const RABBITMQ_AUTH_QUEUE = "rangein.auth";
export const RABBITMQ_USERS_QUEUE = "rangein.users";
export const RABBITMQ_WORKSPACE_QUEUE = "rangein.workspace";
export const MessagePatterns = {
  auth: {
    login: "auth.login",
    register: "auth.register",
  },
  users: {
    create: "users.create",
    findByEmail: "users.findByEmail",
    findAll: "users.findAll",
    findOne: "users.findOne",
  },
  workspaces: {
    addMember: "workspaces.addMember",
    create: "workspaces.create",
    findAll: "workspaces.findAll",
    findMembers: "workspaces.findMembers",
    findOne: "workspaces.findOne",
    remove: "workspaces.remove",
    update: "workspaces.update",
  },
  boards: {
    create: "boards.create",
    findAll: "boards.findAll",
    findOne: "boards.findOne",
    remove: "boards.remove",
    update: "boards.update",
  },
  tasks: {
    create: "tasks.create",
    findAll: "tasks.findAll",
    findOne: "tasks.findOne",
    remove: "tasks.remove",
    update: "tasks.update",
  },
} as const;
