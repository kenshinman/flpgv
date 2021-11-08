import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/colors";

interface IAnimes {
  id: number;
  siteUrl: string;
  title: {
    english: string;
    native: string;
  };
}

interface IResults {
  Page: {
    media: IAnimes[];
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
    };
  };
}
interface IAnimeVars {
  perPage: number;
  page?: number;
}

const REPOS = gql`
  query UserRepos($perPage: Int, $page: Int) {
    Page(perPage: $perPage, page: $page) {
      media {
        id
        siteUrl
        title {
          english
          native
        }
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
  }
`;

const ListItem = ({ title, siteUrl }: IAnimes) => (
  <View style={styles.listItem}>
    <Text style={styles.itemText}>
      {title.english} ({title.native})
    </Text>
    <Text style={styles.itemUrl}>{siteUrl}</Text>
  </View>
);

const MyAnimeList = () => {
  const { data, error, loading, fetchMore } = useQuery<IResults, IAnimeVars>(
    REPOS,
    {
      variables: {
        perPage: 2,
        page: 0,
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

  console.log({ data });

  return (
    <>
      <View>
        <TouchableOpacity activeOpacity={0.75} style={styles.btn}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const { pageInfo } = data?.Page;
            // console.log({ pageInfo });
            // return;
            if (pageInfo.hasNextPage) {
              fetchMore({
                variables: {
                  page: pageInfo.currentPage + 1,
                },
                // updateQuery: (existing, { fetchMoreResult }) => {
                //   console.log({ existing });
                //   if (!fetchMoreResult) return existing;
                //   console.log({ fetchMoreResult });
                //   return {
                //     ...fetchMoreResult,
                //     media: [...existing.media, ...fetchMoreResult.media],
                //   };
                // },
              });
            }
          }}
          activeOpacity={0.75}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Load more</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.Page.media}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item, index }) => (
          <React.Fragment key={item.id}>
            <Text>{index + 1}</Text>
            <ListItem {...item} />
          </React.Fragment>
        )}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator color={colors.white} size={"large"} />
          ) : null
        }
        ListEmptyComponent={() =>
          !data?.Page?.media?.length && !loading ? (
            <Text style={{ textAlign: "center", color: colors.white }}>
              No items to display
            </Text>
          ) : null
        }
        // onEndReached={() => {
        //   const { endCursor, hasNextPage } = data?.user.repositories.pageInfo;
        //   console.log({ hasNextPage });

        //   if (hasNextPage) {
        //     fetchMore({
        //       variables: {
        //         after: endCursor,
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

export default MyAnimeList;
