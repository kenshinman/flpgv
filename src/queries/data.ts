import gql from "graphql-tag";

export const DATA = gql`
  mutation Login($identity: String!) {
    Login(identity: $identity, password: $password, accountType: $accountType) {
      data
      token
      message
      success
    }
  }
`;
