import { gql, GraphQLClient } from 'graphql-request';

import * as credentials from '../config/credentials';

class PostsExternalService {

  PH_API_URL = process.env.PH_API_URL || "https://api.producthunt.com/";
  PH_API_GRAPHQL = `${this.PH_API_URL + (this.PH_API_URL.slice(-1) === "/" ? "" : "/")}v2/api/graphql/`;

  constructor() {
    //
  }

  getPostsData() {
    const graphQLClient = new GraphQLClient(this.PH_API_GRAPHQL, {
      headers: {
        authorization: 'Bearer ' + credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN
      },
    });

    const dateString: string = "2023-10-30T00:00:00Z" // API expects DateTime (ISO-8601 encoded UTC date string) // max 20 posts per page!

    const queryDocument = gql`
      query GetPostsPageByDate($date: DateTime!, $afterCursor: String = "") {
        posts(
          first: 20
          postedAfter: "2023-10-25T00:00:00Z",
          postedBefore: $date,
          order: NEWEST
          after: $afterCursor
        ) {
          totalCount
          edges {
            cursor
            node {
              id
              name
              description
              votesCount
              createdAt
              url
              website
              thumbnail {
                type
                url
              }
              productLinks {
                type
                url
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    type Data = {
      posts: {
        edges: [
          {
            cursor: String,
            node: {
              id: string,
              name: string,
              votesCount: number,
              createdAt: string,
              url: String,
              website: String,
              thumbnail: {
                type: String,
                url: String
              }
              productLinks: [
                {
                  type: String,
                url: String
                }
              ]
            }
          }
        ],
        pageInfo: {
          endCursor: String,
          hasNextPage: boolean
        }
      }
    };

    return graphQLClient.request<Data>(queryDocument, {date: dateString, afterCursor: ""});
  }

}

const postsExternalService = new PostsExternalService();

export default postsExternalService;