import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import MyList from "./src/components/MyList";
import { authLink, httpLink } from "./src/config/authLink";
import { colors } from "./src/constants/colors";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          search: {
            keyArgs: false,
            merge(existing = { nodes: [] }, incoming) {
              if (!existing) return incoming;
              incoming = {
                ...incoming,
                nodes: [...existing.nodes, ...incoming.nodes],
              };

              return incoming;
            },
          },
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Search Repositories</Text>
        <MyList />
      </SafeAreaView>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.white,
  },
});
