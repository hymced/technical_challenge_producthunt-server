"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const credentials = __importStar(require("../config/credentials"));
class PostsExternalService {
    constructor() {
        this.PH_API_URL = process.env.PH_API_URL || "https://api.producthunt.com/";
        this.PH_API_GRAPHQL = `${this.PH_API_URL + (this.PH_API_URL.slice(-1) === "/" ? "" : "/")}v2/api/graphql/`;
        //
    }
    getPostsData(dateString) {
        const graphQLClient = new graphql_request_1.GraphQLClient(this.PH_API_GRAPHQL, {
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
        const dateNext = new Date(dateString);
        dateNext.setDate(dateNext.getDate() + 1);
        const queryDocument = (0, graphql_request_1.gql) `
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
        return graphQLClient.request(queryDocument, { date: dateString, dateNext: dateNext, afterCursor: "" });
    }
}
const postsExternalService = new PostsExternalService();
exports.default = postsExternalService;
