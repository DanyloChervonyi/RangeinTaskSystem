import type { Board } from "../../../types/workspace";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  board: Board;
}

export function BoardColumn({ board }: BoardColumnProps) {
  return (
    <article className="board-column">
      <header className="board-column-header">
        <h3>{board.name}</h3>
        <span>{board.tasks.length}</span>
      </header>

      <ul className="task-list">
        {board.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </article>
  );
}
