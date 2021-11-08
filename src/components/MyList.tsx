import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { client } from "../../App";
import { colors } from "../constants/colors";

interface IAnimes {
  id: string;
  name: string;
  url: string;
}

interface IResults {
  search: {
    nodes: IAnimes[];
    pageInfo: {
      endCursor: number;
      hasNextPage: boolean;
    };
  };
}
interface IAnimeVars {
  first: number;
  query: string;
  after?: string | null;
}

const REPOS = gql`
  query UserRepos($first: Int!, $query: String!, $after: String) {
    search(first: $first, type: REPOSITORY, query: $query, after: $after) {
      nodes {
        ... on Repository {
          id
          name
          url
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const ListItem = ({ name, url }: IAnimes) => (
  <View style={styles.listItem}>
    <Text style={styles.itemText}>{name}</Text>
    <Text style={styles.itemUrl}>{url}</Text>
  </View>
);

const MyList = () => {
  const [inputValue, setInputValue] = useState("");
  const { data, error, loading, fetchMore } = useQuery<IResults, IAnimeVars>(
    REPOS,
    {
      variables: {
        first: 10,
        query: inputValue,
        after: null,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const doFetch = () => {
    if (inputValue.length < 3) {
      return alert("You need to enter at lease 3 characters to search :)");
    }

    fetchMore({
      variables: {
        query: inputValue,
        after: null,
      },
    });
  };

  const clear = () => {
    client.clearStore();
  };

  if (error) {
    console.log(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something went wrong. Please try again.</Text>
      </View>
    );
  }

  return (
    <>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Search Repositories..."
          onChangeText={(text) => setInputValue(text)}
          value={inputValue}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          onPress={() => {
            doFetch();
          }}
          activeOpacity={0.75}
          style={[styles.btn, loading && { opacity: 0.5 }]}
          disabled={loading}
        >
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.search.nodes}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => <ListItem key={item.id} {...item} />}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator color={colors.white} size={"large"} />
          ) : null
        }
        ListEmptyComponent={() =>
          !data?.search.nodes?.length && !loading ? (
            <Text style={{ textAlign: "center", color: colors.white }}>
              No items to display
            </Text>
          ) : null
        }
        onEndReached={() => {
          const { endCursor, hasNextPage } = data?.search.pageInfo;

          if (hasNextPage) {
            fetchMore({
              variables: {
                query: inputValue,
                after: endCursor,
              },
            });
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.grey,
    height: 40,
    color: colors.black,
    borderRadius: 4,
    marginHorizontal: 16,
    paddingHorizontal: 8,
    marginVertical: 8,
    textAlign: "center",
  },
  listItem: {
    height: 80,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  itemText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemUrl: {
    fontSize: 12,
    fontWeight: "300",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grey,
  },
  btn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    marginHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  btnText: {
    color: colors.grey,
  },
});

export default MyList;
