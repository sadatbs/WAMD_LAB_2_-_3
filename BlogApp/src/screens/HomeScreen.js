import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList} from "react-native";
import { Card } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import PostCardComponent from "./../components/PostCardComponent";
import HeaderComponent from "./../components/HeaderComponent";
import StoreDataComponent from "../components/StoreDataComponent";
import { AsyncStorage } from "react-native";
import {getDataJSON,storeDataJSON} from "./../functions/AsyncStorageFunctions";
import { Button } from "react-native-elements";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const HomeScreen = (props) => {

  const [posts, setPosts] = useState([]);
  const [postID, setpostID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState([]);


  const [count, setCount] = useState(0);
  const [icon, setIcon] = useState(["like2"]);



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

  const getAllPosts = async () => {
    let keys = await getAllData();
    let allposts = [];
    try {
        if (keys != null) {
            for (let key of keys) {
                if (key.includes('post')) {
                    let post = await getDataJSON(key);
                    allposts.push(post);
                    
                }
            }
            return allposts;
        }
    } catch (error) {
        alert(error);
    }
}

  const loadPosts = async () => {
    let response = await getAllPosts();
    if (response != null) {
      setPosts(response);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [getAllPosts]);

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
              <StoreDataComponent
                Text="What's On Your Mind ?"
                currentFunc={setInput}
                currentText={input}
                pressFunction={async () => {
                  setpostID(["post"+Math.floor(Math.random()*255)]);
                  let currentPost = {
                    username: auth.CurrentUser.username,
                    name: auth.CurrentUser.name,
                    postID: postID,
                    post: input,
                    likes: 0,
                  };
                  storeDataJSON(
                    JSON.stringify(postID),
                    JSON.stringify(currentPost)
                  );
            
                  alert("Post Saved!")
                  let UserData = await getDataJSON(JSON.stringify(postID));
                  console.log(UserData);
                  loadPosts();
                }}
              />
            </Card>
            <FlatList
              data={posts}
              onRefresh={loadPosts}
              refreshing={loading}
              renderItem={function ({ item }) {
                let data = JSON.parse(item)
                return (
                  <View>
                    <Card containerStyle={styles.card__today}>
                      <PostCardComponent
                        author={data.name}
                        body={data.post}
                      />
                      <Card.Divider />
<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            type="outline"
            title={`Like (${count})`}
            icon={<AntDesign name={icon} size={24} color="dodgerblue" />}
            onPress={function () {
              if (icon== "like2") {
                setCount(count + 1);
                setIcon("like1")
              }
              else {
                setCount(count - 1);
                setIcon("like2");
              }
            }}
          />
          <Button
            type="outline"
            icon={<FontAwesome name="comment" size={24} color="dodgerblue" />}
            title=" Comment"
            onPress={() => {
              props.navigation.navigate("PostScreen", {
                postId: data.postID,
              });
            }}
          />
        </View>


                    </Card>
                  </View>
                );
              }}
            />
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
  card__today: {
    display: "flex",
    flexDirection: "column", 
    backgroundColor: "rgb( 234, 234, 234 )"
},
});

export default HomeScreen;