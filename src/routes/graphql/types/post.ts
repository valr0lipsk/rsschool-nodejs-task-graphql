import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';

export type PostType = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export const Post = new GraphQLObjectType<PostType, Context>({
  name: 'Post',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
