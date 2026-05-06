import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { taskService, projectService, tagService } from './services';
import {
  createTaskInputSchema,
  updateTaskInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  createTagInputSchema,
  updateTagInputSchema,
} from './validation/schemas';

dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json());
app.use(cors());

function sendError(res: Response, status: number, error: unknown) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  res.status(status).json({ error: message });
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

// Projects
app.get('/projects', async (_req, res) => {
  try {
    res.json(await projectService.getAllProjects());
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.get('/projects/:id', async (req, res) => {
  try {
    const project = await projectService.getProjectById(Number(req.params.id));
    if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
    res.json(project);
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.post('/projects', async (req, res) => {
  try {
    const input = createProjectInputSchema.parse(req.body);
    res.status(201).json(await projectService.createProject(input));
  } catch (error) {
    sendError(res, error instanceof ZodError ? 400 : 500, error);
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const input = updateProjectInputSchema.parse(req.body);
    res.json(await projectService.updateProject(Number(req.params.id), input));
  } catch (error) {
    sendError(res, error instanceof ZodError ? 400 : 500, error);
  }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    await projectService.deleteProject(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    sendError(res, 500, error);
  }
});

// Tasks
app.get('/tasks', async (req, res) => {
  try {
    const { projectId, tagId, priority, status } = req.query;
    res.json(await taskService.getAllTasks({
      projectId: projectId !== undefined ? Number(projectId) : undefined,
      tagId: tagId !== undefined ? Number(tagId) : undefined,
      priority: priority !== undefined ? Number(priority) : undefined,
      status: status !== undefined ? Number(status) : undefined,
    }));
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
    res.json(task);
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const input = createTaskInputSchema.parse(req.body);
    res.status(201).json(await taskService.createTask(input));
  } catch (error) {
    sendError(res, error instanceof ZodError ? 400 : 500, error);
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const input = updateTaskInputSchema.parse(req.body);
    res.json(await taskService.updateTask(Number(req.params.id), input));
  } catch (error) {
    sendError(res, error instanceof ZodError ? 400 : 500, error);
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.post('/tasks/:taskId/tags/:tagId', async (req, res) => {
  try {
    res.json(await taskService.addTagToTask(Number(req.params.taskId), Number(req.params.tagId)));
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.delete('/tasks/:taskId/tags/:tagId', async (req, res) => {
  try {
    res.json(await taskService.removeTagFromTask(Number(req.params.taskId), Number(req.params.tagId)));
  } catch (error) {
    sendError(res, 500, error);
  }
});

// Tags
app.get('/tags', async (_req, res) => {
  try {
    res.json(await tagService.getAllTags());
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.get('/tags/:id', async (req, res) => {
  try {
    const tag = await tagService.getTagById(Number(req.params.id));
    if (!tag) { res.status(404).json({ error: 'Tag not found' }); return; }
    res.json(tag);
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.post('/tags', async (req, res) => {
  try {
    const input = createTagInputSchema.parse(req.body);
    res.status(201).json(await tagService.createTag(input));
  } catch (error) {
    sendError(res, error instanceof ZodError ? 400 : 500, error);
  }
});

app.put('/tags/:id', async (req, res) => {
  try {
    const input = updateTagInputSchema.parse(req.body);
    res.json(await tagService.updateTag(Number(req.params.id), input));
  } catch (error) {
    sendError(res, error instanceof ZodError ? 400 : 500, error);
  }
});

app.delete('/tags/:id', async (req, res) => {
  try {
    await tagService.deleteTag(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    sendError(res, 500, error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
