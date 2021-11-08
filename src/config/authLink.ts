import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { token } from "./config";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export { authLink, httpLink };
