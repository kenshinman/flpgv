import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/colors";

interface IRepos {
  id: string;
  name: string;
  url: string;
}

interface IResults {
  user: {
    repositories: {
      nodes: IRepos[];
      totalCount: number;
      pageInfo: {
        endCursor: string;
      };
    };
  };
}
interface IRepoVars {
  first: number;
  login: string;
}

const COUNTRIES = gql`
  query UserRepos($login: String!, $first: Int, $after: String) {
    user(login: $login) {
      repositories(first: $first, after: $after) {
        totalCount
        nodes {
          id
          name
          url
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const ListItem = ({ name, url }: IRepos) => (
  <View style={styles.listItem}>
    <Text style={styles.itemText}>{name}</Text>
    <Text style={styles.itemUrl}>{url}</Text>
  </View>
);

const Countries = () => {
  const [username, setUsername] = useState("kenshinman");

  const { data, error, loading, fetchMore } = useQuery<IResults, IRepoVars>(
    COUNTRIES,
    {
      variables: {
        first: 10,
        login: username,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

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
        {/* <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
          placeholder="Enter GitHub username"
        /> */}
        <TouchableOpacity activeOpacity={0.75} style={styles.btn}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.user.repositories.nodes}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => <ListItem key={item.id} {...item} />}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator color={colors.white} size={"large"} />
          ) : null
        }
        ListEmptyComponent={() =>
          !data?.user.repositories.nodes?.length && !loading ? (
            <Text style={{ textAlign: "center", color: colors.white }}>
              No items to display
            </Text>
          ) : null
        }
        // onEndReached={() => {
        //   const after = data?.user.repositories.pageInfo.endCursor;
        //   const { totalCount } = data?.user.repositories;
        //   const { nodes } = data?.user.repositories;
        //   // console.log({ totalCount, nodes: nodes.length });
        //   if (nodes.length < totalCount) {
        //     fetchMore({
        //       variables: {
        //         after,
        //       },
        //     });
        //   }
        // }}
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

export default Countries;
