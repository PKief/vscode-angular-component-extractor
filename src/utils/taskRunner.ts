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
  return tasks.reduce((promise: Promise<void>, task: Task) => {
    return promise.then(() => {
      updateProgress(tasks.length, progress, task.message);
      return task.execute();
    });
  }, Promise.resolve());
};

const updateProgress = (
  amount: number,
  progress: Progress,
  message: string
) => {
  const increment = 100 / amount;
  progress.report({ message, increment });
};
