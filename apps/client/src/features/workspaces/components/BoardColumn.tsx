import type { Board } from "../../../types/workspace";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  board: Board;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onCreateTask: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

export function BoardColumn({
  board,
  canMoveLeft,
  canMoveRight,
  onCreateTask,
  onDelete,
  onEdit,
  onMoveLeft,
  onMoveRight,
}: BoardColumnProps) {
  return (
    <article className="board-column">
      <header className="board-column-header">
        <h3>{board.name}</h3>
        <span>{board.tasks.length}</span>
      </header>

      <div className="board-actions">
        <button className="button-secondary" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="button-secondary" disabled={!canMoveLeft} onClick={onMoveLeft} type="button">
          Left
        </button>
        <button className="button-secondary" disabled={!canMoveRight} onClick={onMoveRight} type="button">
          Right
        </button>
        <button className="button-danger" onClick={onDelete} type="button">
          Delete
        </button>
      </div>

      <ul className="task-list">
        {board.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>

      <button className="button-primary button-full" onClick={onCreateTask} type="button">
        Add task
      </button>
    </article>
  );
}
