import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Context } from './context.js';

export type MemberTypeId = 'BASIC' | 'BUSINESS';

export type MemberTypeData = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};

export const MemberTypeEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: 'BASIC',
    },
    BUSINESS: {
      value: 'BUSINESS',
    },
  },
});

export const MemberType = new GraphQLObjectType<MemberTypeData, Context>({
  name: 'MemberType',
  fields: {
    id: {
      type: new GraphQLNonNull(MemberTypeEnum),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});
