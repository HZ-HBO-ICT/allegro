import { taskService, projectService, tagService } from '../services';

export const Query = {
  // Task queries
  async tasks(
    _: unknown,
    {
      projectId,
      tagId,
      priority,
      status,
    }: {
      projectId?: number;
      tagId?: number;
      priority?: number;
      status?: number;
    }
  ) {
    return taskService.getAllTasks({
      projectId,
      tagId,
      priority,
      status,
    });
  },

  async task(_: unknown, { id }: { id: number }) {
    return taskService.getTaskById(id);
  },

  // Project queries
  async projects() {
    return projectService.getAllProjects();
  },

  async project(_: unknown, { id }: { id: number }) {
    return projectService.getProjectById(id);
  },

  // Tag queries
  async tags() {
    return tagService.getAllTags();
  },

  async tag(_: unknown, { id }: { id: number }) {
    return tagService.getTagById(id);
  },
};
