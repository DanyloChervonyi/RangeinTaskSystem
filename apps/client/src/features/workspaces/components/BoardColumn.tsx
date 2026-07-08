import { useTextFieldSubmit } from "../../../hooks/useTextFieldSubmit";
import type { Board } from "../../../types/workspace";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  addTask: (workspaceId: string, boardId: string, input: { title: string }) => string;
  board: Board;
  workspaceId: string;
}

export function BoardColumn({ addTask, board, workspaceId }: BoardColumnProps) {
  const handleAddTask = useTextFieldSubmit({
    fieldName: "taskTitle",
    onSubmit: (title) => addTask(workspaceId, board.id, { title }),
  });

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

      <form className="entity-form entity-form-compact" onSubmit={handleAddTask}>
        <label htmlFor={`task-title-${board.id}`}>New task</label>
        <div>
          <input
            id={`task-title-${board.id}`}
            name="taskTitle"
            placeholder="Task title"
            type="text"
          />
          <button type="submit">Add</button>
        </div>
      </form>
    </article>
  );
}
