import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeData } from './memberType.js';
import { Post, PostType } from './post.js';
import { Context } from './context.js';

type ProfileType = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: MemberTypeData;
};

type UserType = {
  id: string;
  name: string;
  balance: number;
  profile?: ProfileType;
  posts?: PostType[];
  userSubscribedTo?: UserType[];
  subscribedToUser?: UserType[];
};

export const Profile = new GraphQLObjectType<ProfileType, Context>({
  name: 'Profile',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
    },
  },
});

export const User = new GraphQLObjectType<UserType, Context>({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: Profile,
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (route) => {
        return route.userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (route) => {
        return route.subscribedToUser;
      },
    },
  }),
});
