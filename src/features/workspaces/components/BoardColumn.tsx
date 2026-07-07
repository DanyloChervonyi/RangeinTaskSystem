import type { Board } from "../../../types/workspace";

interface BoardColumnProps {
  board: Board;
}

export function BoardColumn({ board: _board }: BoardColumnProps) {
  void _board;

  return null;
}
