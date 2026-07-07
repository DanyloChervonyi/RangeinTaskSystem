import type { Task } from "../../../types/workspace";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task: _task }: TaskCardProps) {
  void _task;

  return null;
}
