import { taskService, projectService, tagService } from '../services';
import { TaskInput, TaskUpdateInput, ProjectInput, ProjectUpdateInput, TagInput, TagUpdateInput } from '../types';
import {
  createTaskInputSchema,
  updateTaskInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  createTagInputSchema,
  updateTagInputSchema,
} from '../validation/schemas';
import { handleValidationError, handleDatabaseError } from '../utils/errors';

export const Mutation = {
  // Task mutations
  async createTask(_: unknown, { input }: { input: TaskInput }) {
    try {
      const validated = createTaskInputSchema.parse(input);
      return await taskService.createTask(validated);
    } catch (error) {
      return handleValidationError(error);
    }
  },

  async updateTask(_: unknown, { id, input }: { id: number; input: TaskUpdateInput }) {
    try {
      const validated = updateTaskInputSchema.parse(input);
      return await taskService.updateTask(id, validated);
    } catch (error) {
      return handleValidationError(error);
    }
  },

  async deleteTask(_: unknown, { id }: { id: number }) {
    try {
      return await taskService.deleteTask(id);
    } catch (error) {
      return handleDatabaseError(error);
    }
  },

  // Project mutations
  async createProject(_: unknown, { input }: { input: ProjectInput }) {
    try {
      const validated = createProjectInputSchema.parse(input);
      return await projectService.createProject(validated);
    } catch (error) {
      return handleValidationError(error);
    }
  },

  async updateProject(_: unknown, { id, input }: { id: number; input: ProjectUpdateInput }) {
    try {
      const validated = updateProjectInputSchema.parse(input);
      return await projectService.updateProject(id, validated);
    } catch (error) {
      return handleValidationError(error);
    }
  },

  async deleteProject(_: unknown, { id }: { id: number }) {
    try {
      return await projectService.deleteProject(id);
    } catch (error) {
      return handleDatabaseError(error);
    }
  },

  // Tag mutations
  async createTag(_: unknown, { input }: { input: TagInput }) {
    try {
      const validated = createTagInputSchema.parse(input);
      return await tagService.createTag(validated);
    } catch (error) {
      return handleValidationError(error);
    }
  },

  async updateTag(_: unknown, { id, input }: { id: number; input: TagUpdateInput }) {
    try {
      const validated = updateTagInputSchema.parse(input);
      return await tagService.updateTag(id, validated);
    } catch (error) {
      return handleValidationError(error);
    }
  },

  async deleteTag(_: unknown, { id }: { id: number }) {
    try {
      return await tagService.deleteTag(id);
    } catch (error) {
      return handleDatabaseError(error);
    }
  },

  // Task-Tag relationship mutations
  async addTagToTask(_: unknown, { taskId, tagId }: { taskId: number; tagId: number }) {
    try {
      return await taskService.addTagToTask(taskId, tagId);
    } catch (error) {
      return handleDatabaseError(error);
    }
  },

  async removeTagFromTask(_: unknown, { taskId, tagId }: { taskId: number; tagId: number }) {
    try {
      return await taskService.removeTagFromTask(taskId, tagId);
    } catch (error) {
      return handleDatabaseError(error);
    }
  },
};
