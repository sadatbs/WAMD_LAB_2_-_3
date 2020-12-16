import React, { useState, useEffect} from "react";
import { View, StyleSheet} from "react-native";
import { Card, Button, Text, Avatar,ThemeProvider } from "react-native-elements";
import { useColorScheme } from 'react-native-appearance';
import { AntDesign } from "@expo/vector-icons";
import { format } from 'date-fns';
import * as firebase from "firebase";
import "firebase/firestore";

const theme = {
    Button: {
      raised: true,
    },
  };



const PostCard = (props) => {
  const user = firebase.auth().currentUser;
  let colorScheme = useColorScheme();
  const [Liked, setLiked] = useState(false);
  const [LikesCounter, setLikesCounter] = useState(0);
  const [CommentsCounter, setCommentsCounter] = useState(0);


  
  const getTotalLikes = async (id)=>{
    firebase.firestore().collection('posts').doc(id).onSnapshot( async (doc)=>{
      let snap = doc.data();
      if(snap.likes !== undefined){
        setLikesCounter(snap.likes.length);
      }else{
        alert("Error!!");
      }
    });
  }

  const getTotalComments = async (id)=>{
    firebase.firestore().collection('posts').doc(id).onSnapshot( async (doc)=>{
      let snap = doc.data();
      if(snap.comments !== undefined){
        setCommentsCounter(Object.keys(snap.comments).length);
      }else{
        alert("Error!!");
      }
    });
  }

  const manipulateLike = async (likepostid, userid) => {
    if(Liked == false){
      const doc = firebase.firestore().collection('posts').doc(likepostid).update({
        likes: firebase.firestore.FieldValue.arrayUnion(userid)
      }).then(async () => {
        setLiked(true);
      }).catch((error) => {
        alert(error);
      });
    }else{
      const doc = firebase.firestore().collection('posts').doc(likepostid).update({
        likes: firebase.firestore.FieldValue.arrayRemove(userid)
      }).then( async () => {
        setLiked(false);
      }).catch((error) => {
        alert(error);
      });
    }
  }

  const postCreationTimeStamp = (timestamp) =>{
    var fromUnixTime = require('date-fns/fromUnixTime');
    var result = fromUnixTime(timestamp.seconds);
    var timestamp = format(result, 'd MMM yyyy h:m a')
    return ( <Text> {timestamp} </Text>);
  }


  useEffect(() => {
    getTotalLikes(props.postId);
    getTotalComments(props.postId);
  }, []);



  return (
    <ThemeProvider  useDark={colorScheme === 'dark'}>
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          containerStyle={{ backgroundColor: "lightblue", marginTop: 10 }}
          rounded
          size={50}
          icon={{ name: "user", type: "font-awesome", color: "dodgerblue" }}
        />
        <View 
          style={{
            flexDirection: "column",
            paddingHorizontal: 10,
          }}
        >
          <Text h4Style={{fontSize: 15, fontStyle:"italic"}} h4>{props.author}</Text>
          <Text h5>{postCreationTimeStamp(props.createdAt)}</Text>
        </View>
      </View>
        <Text
          style={{
            padding: 5,
            marginBottom: 10,
            fontSize: 13,
            alignContent: "center"
          }}
        >
          {props.body}
        </Text>
      <Card.Divider />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          type="outline"
          title= {`Like (${LikesCounter})`}
          icon={<AntDesign name="like2" size={24} color="dodgerblue" />}
          onPress={ function () {
            
            manipulateLike(props.postId, user.uid);
          }}
        />
        <Button type="outline" title={`Comments(${CommentsCounter})`}
          buttonStyle={{backgroundColor: "white"}}
          onPress={ function () {
            props.navigation.navigate("PostScreen",{
              postid: props.postId,
            });
          }}
        />
      </View>
    </Card>
    </ThemeProvider>
  );
};

export default PostCard;