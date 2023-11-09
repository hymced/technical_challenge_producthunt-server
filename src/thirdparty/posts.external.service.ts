import { gql, GraphQLClient } from 'graphql-request';

import * as credentials from '../config/credentials';

class PostsExternalService {

  PH_API_URL = process.env.PH_API_URL || "https://api.producthunt.com/";
  PH_API_GRAPHQL = `${this.PH_API_URL + (this.PH_API_URL.slice(-1) === "/" ? "" : "/")}v2/api/graphql/`;

  constructor() {
    //
  }

  getPostsData(dateString: string) {
    const graphQLClient = new GraphQLClient(this.PH_API_GRAPHQL, {
      headers: {
        authorization: 'Bearer ' + credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN
      },
    });

    // const dateString: string = "2023-10-30T00:00:00Z" // API expects DateTime (ISO-8601 encoded UTC date string) // max 20 posts per page!
    // const dateNext = new Date((new Date(dateString)).getTime() + 1000*60*60*24)
    if (!dateString) {
      const dateYesterday = new Date();
      dateYesterday.setDate(dateYesterday.getDate() - 1);
      dateString = dateYesterday.toISOString();
    }
    const dateNext = new Date(dateString)
    dateNext.setDate(dateNext.getDate() + 1)

    const queryDocument = gql`
      query GetPostsPageByDate($date: DateTime!, $dateNext: DateTime!, $afterCursor: String = "") {
        posts(
          first: 20
          postedAfter: $date,
          postedBefore: $dateNext,
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

    return graphQLClient.request<Data>(queryDocument, {date: dateString, dateNext: dateNext, afterCursor: ""});
  }

}

const postsExternalService = new PostsExternalService();

export default postsExternalService;