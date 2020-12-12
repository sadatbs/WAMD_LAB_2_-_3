import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ScrollView, } from "react-native";
import { Card } from "react-native-elements";
import PostCardComponent from "../components/PostCardComponent";

import { AuthContext } from "../providers/AuthProvider";

import { getDataJSON, removeData, storeDataJSON } from "../functions/AsyncStorageFunctions";
import HeaderComponent from "../components/HeaderComponent";
import StoreDataComponent from "../components/StoreDataComponent";
import { AsyncStorage } from "react-native";


const PostScreen = (props) => {
  const postID = props.route.params.postId;
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState([]);
  const [commentID, setCommentID]=useState(0);


  const loadIndividualPost = async () => {
    let response = await getDataJSON(JSON.stringify(postID));
    if (response != null) {
      return response;
    }
  };

  const getAllData = async () => {
    let data = []
    try {
      data = await AsyncStorage.getAllKeys();
      if (data != null) {
        return data;
      } else {
        alert("No data with this key!");
      }
    } catch (error) {
      alert(error);
    }
  };

  const getAllComments = async () => {
    let keys = await getAllData();
    let allComments = [];
    try {
        if (keys != null) {
            for (let key of keys) {
                if (key.includes('comment')) {
                  
                    let comment = await getDataJSON(key);
                    allComments.push(comment);
                }
            }
            return allComments;
        }
    } catch (error) {
        alert(error);
    }
  }

  const loadComments = async () => {
    
    let response = await getAllComments();
    if (response != null) {
      setComments(response);
    }
  };

  useEffect(() => {
    loadIndividualPost().then((response) => {
      setPosts(JSON.parse(response));
    });
    loadComments();
  }, []);

    return (
      <AuthContext.Consumer>
        {(auth) => (
          <View style={styles.viewStyle}>
            <HeaderComponent
              DrawerFunction={() => {
                props.navigation.toggleDrawer();
              }}
            />

            <Card>
              <Card.Title>The post</Card.Title>
              <PostCardComponent
                author={posts.name}
                body={posts.post}
              />
            </Card>
            <Card>
                <StoreDataComponent
                  Text="Post a Comment"
                  currentFunc={setInput}
                  currentText={input}
                  pressFunction={async () => {
                      setCommentID(["comment" + Math.floor(Math.random()*255)]);
                      let currentComment = {
                        post: postID,
                        reciever: posts.name,
                        commentId:commentID,
                        commneterID: auth.CurrentUser.username,
                        commenter: auth.CurrentUser.name,
                        comment: input,
                      };
                
                      storeDataJSON(
                        JSON.stringify(commentID),
                        JSON.stringify(currentComment)
                      );
                
                      alert("Comment Saved!")
                      let UserData = await getDataJSON(JSON.stringify(commentID));
                      console.log(UserData);
                      loadComments();
                  }}
                />
            </Card>

            <ScrollView>
            <Card>
              <Card.Title>Comments for this post</Card.Title>
              <FlatList
                data={comments}
                onRefresh={loadComments}
                refreshing={loading}
                renderItem={function ({ item }) {
                  let data = JSON.parse(item);
                  if (JSON.stringify(data.post) === JSON.stringify(postID)) {
                    return (
                      <View>
                          <PostCardComponent
                            author={data.commenter}
                            body={data.comment}
                          />
                      </View>
                    );
                  }
                }
                }
              />
            </Card>
            </ScrollView>

          </View>
        )}
      </AuthContext.Consumer>
    );
 
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

export default PostScreen;