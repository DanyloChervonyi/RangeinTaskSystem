"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePatterns = exports.RABBITMQ_WORKSPACE_QUEUE = exports.RABBITMQ_AUTH_QUEUE = exports.WORKSPACE_RABBITMQ_CLIENT = exports.AUTH_RABBITMQ_CLIENT = void 0;
exports.AUTH_RABBITMQ_CLIENT = "AUTH_RABBITMQ_CLIENT";
exports.WORKSPACE_RABBITMQ_CLIENT = "WORKSPACE_RABBITMQ_CLIENT";
exports.RABBITMQ_AUTH_QUEUE = "rangein.auth";
exports.RABBITMQ_WORKSPACE_QUEUE = "rangein.workspace";
exports.MessagePatterns = {
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
};
//# sourceMappingURL=rabbitmq.constants.js.map