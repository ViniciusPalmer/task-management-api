import crypto from "node:crypto";

export function createTask(title, description) {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function updateTask(task, title, description, completed) {
  return {
    ...task,
    title: title !== undefined ? title : task.title,
    description: description !== undefined ? description : task.description,
    completed: completed !== undefined ? completed : task.completed,
    updatedAt: new Date(),
  };
}

export function completeTask(task) {
  return {
    ...task,
    completed: true,
    updatedAt: new Date(),
  };
}
