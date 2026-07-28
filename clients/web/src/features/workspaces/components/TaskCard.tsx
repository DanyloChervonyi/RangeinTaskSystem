import { memo } from "react";
import type { TaskCardProps } from "../../../types/props";

function TaskCardComponent({ task }: TaskCardProps) {
  return <li className="task-card">{task.title}</li>;
}

export const TaskCard = memo(TaskCardComponent);
