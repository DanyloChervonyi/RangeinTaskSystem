export declare const AUTH_RABBITMQ_CLIENT = "AUTH_RABBITMQ_CLIENT";
export declare const WORKSPACE_RABBITMQ_CLIENT = "WORKSPACE_RABBITMQ_CLIENT";
export declare const RABBITMQ_AUTH_QUEUE = "rangein.auth";
export declare const RABBITMQ_WORKSPACE_QUEUE = "rangein.workspace";
export declare const MessagePatterns: {
    readonly auth: {
        readonly login: "auth.login";
        readonly register: "auth.register";
    };
    readonly users: {
        readonly findAll: "users.findAll";
        readonly findOne: "users.findOne";
    };
    readonly workspaces: {
        readonly addMember: "workspaces.addMember";
        readonly create: "workspaces.create";
        readonly findAll: "workspaces.findAll";
        readonly findMembers: "workspaces.findMembers";
        readonly findOne: "workspaces.findOne";
        readonly remove: "workspaces.remove";
        readonly update: "workspaces.update";
    };
    readonly boards: {
        readonly create: "boards.create";
        readonly findAll: "boards.findAll";
        readonly findOne: "boards.findOne";
        readonly remove: "boards.remove";
        readonly update: "boards.update";
    };
    readonly tasks: {
        readonly create: "tasks.create";
        readonly findAll: "tasks.findAll";
        readonly findOne: "tasks.findOne";
        readonly remove: "tasks.remove";
        readonly update: "tasks.update";
    };
};
