import type { Task } from "../../../types/workspace";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return <li className="task-card">{task.title}</li>;
}
