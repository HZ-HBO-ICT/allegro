import { GraphQLScalarType, Kind } from 'graphql';
import { Query } from './Query';
import { Mutation } from './Mutation';

// DateTime scalar resolver
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize: (value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue: (value) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date((ast as any).value);
    }
    return null;
  },
});

export const resolvers = {
  Query,
  Mutation,
  DateTime: DateTimeScalar,
  Task: {
    tags: async (parent: any) => {
      if (parent.tags && Array.isArray(parent.tags)) {
        return parent.tags.map((tag: any) => tag.tag || tag);
      }
      return [];
    },
  },
  Tag: {
    tasks: async (parent: any) => {
      if (parent.tasks && Array.isArray(parent.tasks)) {
        return parent.tasks.map((taskTag: any) => taskTag.task || taskTag);
      }
      return [];
    },
  },
  Project: {
    tasks: async (parent: any) => {
      if (parent.tasks && Array.isArray(parent.tasks)) {
        return parent.tasks;
      }
      return [];
    },
  },
};
