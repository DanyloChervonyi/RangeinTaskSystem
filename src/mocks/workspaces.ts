import type { WorkspacesMock } from "../types/workspace";

export const workspacesMock: WorkspacesMock = {
  workspaces: [
    {
      id: "w1",
      name: "Work",
      boards: [
        {
          id: "b1",
          name: "Development",
          tasks: [
            {
              id: "t1",
              title: "Setup project",
            },
            {
              id: "t2",
              title: "Implement auth",
            },
            {
              id: "t3",
              title: "Fix bugs",
            },
          ],
        },
        {
          id: "b2",
          name: "Design",
          tasks: [
            {
              id: "t4",
              title: "Create UI kit",
            },
            {
              id: "t5",
              title: "Landing page",
            },
          ],
        },
      ],
    },
    {
      id: "w2",
      name: "Personal",
      boards: [
        {
          id: "b3",
          name: "Daily Tasks",
          tasks: [
            {
              id: "t6",
              title: "Workout",
            },
            {
              id: "t7",
              title: "Read book",
            },
          ],
        },
        {
          id: "b4",
          name: "Learning",
          tasks: [
            {
              id: "t8",
              title: "Learn TypeScript advanced types",
            },
            {
              id: "t9",
              title: "Practice system design",
            },
          ],
        },
      ],
    },
  ],
};
