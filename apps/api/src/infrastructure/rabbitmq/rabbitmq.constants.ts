export const RABBITMQ_CLIENT = "RABBITMQ_CLIENT";
export const RABBITMQ_QUEUE = "rangein.task-system";
export const MessagePatterns = {
  auth: {
    login: "auth.login",
    register: "auth.register",
  },
  users: {
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
