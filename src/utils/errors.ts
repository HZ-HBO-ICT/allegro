import { GraphQLError } from 'graphql';

export class GraphQLErrorWithStatus extends GraphQLError {
  constructor(
    message: string,
    public statusCode: number = 400,
    originalError?: Error
  ) {
    super(message, {
      originalError,
    });
  }
}

export const handleValidationError = (error: unknown): never => {
  if (error instanceof Error) {
    throw new GraphQLErrorWithStatus(error.message, 400, error);
  }
  throw new GraphQLErrorWithStatus('An unexpected error occurred', 500);
};

export const handleDatabaseError = (error: unknown): never => {
  if (error instanceof Error) {
    const message = error.message || 'Database operation failed';
    throw new GraphQLErrorWithStatus(message, 500, error);
  }
  throw new GraphQLErrorWithStatus('Database operation failed', 500);
};

export const handleNotFoundError = (resource: string): never => {
  throw new GraphQLErrorWithStatus(`${resource} not found`, 404);
};
