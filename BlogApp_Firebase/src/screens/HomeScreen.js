import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ImageBackground} from "react-native";
import { Card } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import HeaderComponent from "./../components/HeaderComponent";
import StoreDataComponent from "../components/StoreDataComponent";
import PostCard from '../components/PostCard'
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from 'firebase';
import 'firebase/firestore';


const HomeScreen = (props) => {

  const [posts, setPosts] = useState([]);
  const user = firebase.auth().currentUser;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState([]);
  const [count, setCount] = useState(0);
  const [icon, setIcon] = useState(["like2"]);


  const loadPosts = async () => {
    firebase
      .firestore()
      .collection("posts")
      .orderBy("created_at", "desc")
      .onSnapshot((querySnapshot) => {
        let temp_posts = [];
        querySnapshot.forEach((doc) => {
          temp_posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(temp_posts);
        
      })
      .catch((error) => {
        alert(error);
      });
  };
  const deletePosts = async (post) => {
    if(post.data.userId == user.uid){
        await firebase.firestore().collection("posts").doc(post.id).delete().then(()=>{
            alert("Post deleted successfully!");
        })
    }else{
        alert("Post can't be deleted!");
    }
}

  useEffect(() => {
    loadPosts();
  
  }, []);

    return (
      <AuthContext.Consumer>
        {(auth) => (
          <View style={styles.viewStyle}>
         <ImageBackground source={require("../../assets/wzuNYC.jpg")} style={styles.image}>
            <HeaderComponent
              DrawerFunction={() => {
                props.navigation.toggleDrawer();
              }}
            />
            <Card>
              <StoreDataComponent
                placeHolder="What's On Your Mind ?"
                currentFunc={setInput}
                currentText={input}
                pressFunction={()=>{
                  firebase
                  .firestore()
                  .collection("posts")
                  .add({
                    userId: auth.CurrentUser.uid,
                    body: input,
                    author: auth.CurrentUser.displayName,
                    created_at: firebase.firestore.Timestamp.now(),
                    likes: [],
                    comments: [],
                  })
                  .then(() => {
                    alert(auth.CurrentUser.uid);
                  })
                  .catch((error) => {
                    alert(error);
                  });
                }}
              />
            </Card>
            <FlatList
              data={posts}
              onRefresh={loadPosts}
              refreshing={loading}
              renderItem={function ({ item }) {
                return (
                  
                  <TouchableOpacity onLongPress={ ()=> {
                    
                   deletePosts(item);
                }}>
                  <PostCard
                                            author={item.data.author}
                                            body={item.data.body}
                                            postId={item.id}
                                            createdAt={item.data.created_at}
                                            navigation={props.navigation}
                                        />
                  
                  </TouchableOpacity>
                );
              }}
            />
            </ImageBackground>
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