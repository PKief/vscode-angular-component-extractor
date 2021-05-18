import * as vscode from "vscode";

type Progress = vscode.Progress<{
  message?: string | undefined;
  increment?: number | undefined;
}>;

type Task = {
  message: string;
  execute: () => Promise<void>;
};

export const startProgress = (tasks: Task[]) => (progress: Progress) => {
  return tasks.reduce((promise, task, index) => {
    return promise.then(() => {
      updateProgress(index, tasks.length, progress, task.message);
      return task.execute();
    });
  }, Promise.resolve());
};

const updateProgress = (
  index: number,
  amount: number,
  progress: Progress,
  message: string
) => {
  const increment = ((index + 1) / amount) * 100;
  progress.report({ message, increment });
};
