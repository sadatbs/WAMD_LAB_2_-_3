import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ImageBackground} from "react-native";
import { Card, Button, Text, Avatar, Input , Header} from "react-native-elements";
import * as firebase from "firebase";
import "firebase/firestore";
import { AuthContext} from "../providers/AuthProvider";
import CommentCard from "../components/commentCardComponent";
import { TouchableOpacity } from "react-native-gesture-handler";

const PostScreen = (props) => {
    let user = firebase.auth().currentUser;
    let userid = user.uid;
    let username = user.displayName;
    let postId = props.route.params.postid;
    const [Post, setPost] = useState({});
    const [Comment, setComment] = useState("");
    let dict = {};
    let [totalComments, setTotalComments] = useState([]);

    const postComment = async (userid)=>{
        if(Comment != ""){
            dict = {
                "comment_poster_id": userid,
                "commentor" : username,
                "comment_body": Comment,
            }
            const doc = firebase.firestore().collection('posts').doc(postId).update({
                comments: firebase.firestore.FieldValue.arrayUnion(dict)
            }).then(()=>{
                alert("Comment posted successfully!");
            });
        }else{
            alert("Field is empty!");
        }
    }

    const loadPost = async (postId)=>{
        firebase.firestore().collection('posts').doc(postId).onSnapshot((doc) => {
            let snap = doc.data();
            setPost(snap);
            setTotalComments(snap.comments)
        });
    }

    const deleteComment = async (item) => {
        if(user.uid == Post.userId || user.uid == item.comment_poster_id){
            firebase.firestore().collection('posts').doc(postId).update({
                comments: firebase.firestore.FieldValue.arrayRemove(item)
            }).then(() => {
                alert("Comment deleted successfully");
            }).catch((error) => {
                alert(error);
            });
        }
        else{
            alert("Comment couldn't be deleted!! authorization error!!");
        }
    }

    useEffect(() => {
        loadPost(postId);
    }, []);

    
    return (
        <AuthContext.Consumer>
            {(auth) => (
                <View style={styles.viewStyle}>
                  <ImageBackground source={require("../../assets/wzuNYC.jpg")} style={styles.image}>
                    <Header
                        containerStyle={{
                        backgroundColor: 'dodgerblue',
                        }}
                        centerComponent={{ text: "Local Blog", style: { color: "#fff", fontSize: 20 } }}
                    />
                    <Card>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                containerStyle={{ backgroundColor: 'lightblue' }}
                                rounded
                                size={45}
                                icon={{ name: "user", type: "font-awesome", color: "dodgerblue" }}
                                activeOpacity={1}
                            />
                            <Text h4Style={{fontSize:15, padding: 10 }} h4>
                                {Post.author}
                            </Text>
                        </View>
                        <Text
                            style={{ fontSize: 13,
                                paddingVertical: 10,
                            }}
                        >
                            {Post.body}
                        </Text>
                        <Card.Divider />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Input
                                inputStyle={styles.inputStyle}
                                placeholder='Comment'
                                onChangeText={function (currentInput) {
                                    setComment(currentInput);
                                }}
                            />
                        </View>
                        <Button type="solid" title="Post Comment"
                        buttonStyle={{backgroundColor: 'dodgerblue'}}
                            onPress={function () {
                                postComment(userid);
                            }}
                        />
                    </Card>  
                    <FlatList
                        data={totalComments}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onLongPress={()=>{
                                    deleteComment(item);
                                }}>
                                    <View>
                                        <CommentCard
                                            commentor={item.commentor}
                                            comment={item.comment_body}
                                        />
                                    </View>
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
        justifyContent: 'center',
    },
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
});

export default PostScreen;