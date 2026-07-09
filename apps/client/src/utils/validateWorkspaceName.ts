export function validateWorkspaceName(name: string) {
  if (name.length < 5) return "Workspace name must be at least 5 characters.";
  if (name.length > 30) return "Workspace name must be 30 characters or less.";
  return null;
}
