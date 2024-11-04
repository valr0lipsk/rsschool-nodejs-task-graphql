import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { MemberType, MemberTypeEnum } from './memberType.js';
import { Profile, User } from './user.js';
import { UUIDType } from './uuid.js';
import { Post } from './post.js';
import {
  ChangePostInput,
  ChangeProfileInput,
  ChangeUserInput,
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
} from './createInputs.js';
import { Context } from './context.js';

type RootType = Record<string, never>;

export const RootQueryType = new GraphQLObjectType<RootType, Context>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_, __, { prisma }) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeEnum),
        },
      },
      resolve: async (_, { id }, { prisma }) => {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_, __, { prisma }) => {
        return prisma.user.findMany({
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        return prisma.user.findUnique({
          where: { id },
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_, __, { prisma }) => {
        return prisma.post.findMany();
      },
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        return prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (_, __, { prisma }) => {
        return prisma.profile.findMany({
          include: {
            memberType: true,
            user: true,
          },
        });
      },
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        return prisma.profile.findUnique({
          where: { id },
          include: {
            memberType: true,
            user: true,
          },
        });
      },
    },
  },
});

export const Mutations = new GraphQLObjectType<RootType, Context>({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }, { prisma }) => {
        return prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }, { prisma }) => {
        return prisma.profile.create({ data: dto });
      },
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_, { dto }, { prisma }) => {
        return prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, { id, dto }, { prisma }) => {
        return prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, { id, dto }, { prisma }) => {
        return prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, { id, dto }, { prisma }) => {
        return prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.user.delete({ where: { id } });
        return 'User deleted successfully';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.post.delete({ where: { id } });
        return 'Post deleted successfully';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
        return 'Profile deleted successfully';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        return 'Subscribed successfully';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        return 'Unsubscribed successfully';
      },
    },
  }),
});
