import * as vscode from "vscode";

type Progress = vscode.Progress<{
  message?: string | undefined;
  increment?: number | undefined;
}>;

type TaskExecution = Promise<unknown>;

type Task = {
  message: string;
  execute: () => TaskExecution;
};

/**
 * Processes multiple tasks in sequence and updates a VS Code progress
 * @param tasks List of tasks
 * @returns Callback that handles a VS Code progress
 */
export const startProgress = (tasks: Task[]) => (progress: Progress) => {
  return tasks.reduce((promise: TaskExecution, task: Task) => {
    return promise.then(() => {
      updateProgress(tasks.length, progress, task.message);
      return task.execute();
    });
  }, Promise.resolve());
};

/**
 * Update the VS Code progress object with a new increment
 * @param amount Amount of tasks
 * @param progress Progress object of VS Code
 * @param message Message which is shown for each executed task
 */
const updateProgress = (
  amount: number,
  progress: Progress,
  message: string
) => {
  const increment = 100 / amount;
  progress.report({ message, increment });
};
