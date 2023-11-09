import { RequestHandler } from 'express';

import authExternalService from '../thirdparty/auth.external.service';
import postsExternalService from '../thirdparty/posts.external.service';

import * as credentials from '../config/credentials';

import { ClientError } from 'graphql-request';
import type { GraphQLError } from 'graphql/error/GraphQLError.js'
import { AxiosError } from 'axios';

import * as utils from '../utils/formatDate';

let refreshTokenCount: number = 0;

export const posts_list = <RequestHandler>(async (req, res, next) => {

  const refreshToken = async () => {
    const response = await authExternalService.getToken()
    credentials.saveToken(response.data.access_token);
    return credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN;
  }

  const startConditionalChaining = () => {
    if(!credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN) {
      return refreshToken();
    } else {
      return Promise.resolve(credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN);
    }
  }

  try {

    await startConditionalChaining();
    const data = await postsExternalService.getPostsData(<string>req.query.date);

    type Data = typeof data;
    type DataNewOnly = {
      posts: {
        edges: [
          {
            node: {
              createdAtFormatted: string,
            }
          }
        ]
      }
    };
    type DataEx = Data & DataNewOnly;
    const dataEx = data as DataEx;

    dataEx.posts.edges.forEach(edge => {
      const edgeEx = edge as DataEx["posts"]["edges"][number] 
      // tricky trick because the first signature of the overloaded forEach method resulting from the intersection is used 
      // (since an edge of DataEx extends an edge of Data aka an edge in dataEx can be assigned to a edge in data), 
      // thus, the edge value of the callbackfn has the type of an edge from Data, and its real type must be asserted
      // alternative: change Data everywhere and add createdAtFormatted beforehand...
      edgeEx.node.createdAtFormatted = utils.getformatedTime(new Date(edgeEx.node.createdAt));
    });

    res.status(200).json(dataEx);

  } catch(error) {

    if (error instanceof AxiosError) {
      if (error.response) {
        //
      }
    }
    if (error instanceof ClientError) {
      if (error.response.errors) {
        interface CustomGraphQLError extends GraphQLError { // weird: received type does not match expected type...
          error: string,
          error_description: string
        }
        if ((<CustomGraphQLError>error.response.errors[0]).error === "invalid_oauth_token") {
          // token expired
          refreshTokenCount++;
          if (refreshTokenCount < 3) {
            console.log("refreshing token and trying again to query the api")
            await refreshToken()
            return posts_list(req, res, next);
          }
        }
      }
    }
    next(error);

  }

});