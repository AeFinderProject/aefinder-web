import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { GraphiQL } from 'graphiql';

import 'graphiql/graphiql.css';

import { schemaData } from './schema';

const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      age
    }
  }
`;

const mocks = [
  {
    request: {
      query: gql`
        query IntrospectionQuery {
          __schema {
            queryType {
              name
            }
            mutationType {
              name
            }
            subscriptionType {
              name
            }
            types {
              ...FullType
            }
            directives {
              name
              description
              locations
              args {
                ...InputValue
              }
            }
          }
        }

        fragment FullType on __Type {
          kind
          name
          description
          fields(includeDeprecated: true) {
            name
            description
            args {
              ...InputValue
            }
            type {
              ...TypeRef
            }
            isDeprecated
            deprecationReason
          }
          inputFields {
            ...InputValue
          }
          interfaces {
            ...TypeRef
          }
          enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
          }
          possibleTypes {
            ...TypeRef
          }
        }

        fragment InputValue on __InputValue {
          name
          description
          type {
            ...TypeRef
          }
          defaultValue
        }

        fragment TypeRef on __Type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    },
    result: {
      data: schemaData,
    },
  },
  {
    request: {
      query: GET_USER_QUERY,
      variables: { id: '1' },
    },
    result: {
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          age: 28,
        },
      },
    },
  },
];

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

interface GraphQLParams {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: { [key: string]: any };
  operationName?: string | null;
}

const graphQLFetcher = async (graphQLParams: GraphQLParams) => {
  try {
    console.log('graphQLParams:', graphQLParams);
    const result = await client.query({
      query: gql`
        ${graphQLParams.query}
      `,
      variables: graphQLParams.variables,
    });
    console.log('result:', result);
    // default return value
    return {
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          age: 28,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { errors: [{ message: error || 'An error occurred' }] };
  }
};

const defaultQuery = `
query GetUser {
  user(id: "1") {
    id
    name
    age
  }
}
`;

export default function GuestPlayground() {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <GraphiQL defaultQuery={defaultQuery} fetcher={graphQLFetcher} />
    </MockedProvider>
  );
}
