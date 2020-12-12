import React, { useState, useEffect } from "react";
import { View, StyleSheet, AsyncStorage, Image} from "react-native";
import { Text, Card, Button, Avatar } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import HeaderHome from "../components/HeaderComponent";
import * as firebase from 'firebase';
import 'firebase/firestore';
const ProfileScreen = (props) => {
  const [Profile, setProfile] = useState({});
    const user = firebase.auth().currentUser;

    const loadProfile = async ()=>{
        const doc = await firebase.firestore().collection('users').doc(user.uid).get().then((doc)=>{
            setProfile(doc.data());
            console.log(doc.data());
        })
    }

    const deleteProfile = async () => {
        firebase.firestore().collection("users").doc(user.uid).delete().then(function () {
            user.delete().then(function () {
                firebase.auth().signOut().then(() => {
                }).catch((error) => {
                    alert(error);
                });
            }).catch(function (error) {
                alert(error);
            });
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

        const doc = await firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
            setProfile(doc.data());
            console.log(doc.data());
        })
    }

    useEffect(() => {
        loadProfile();
    }, []);


      
      return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          
          <HeaderHome
            DrawerFunction={() => {
                props.navigation.toggleDrawer();
            }}
          />

            <Card>
                <View>
                    <Image source={require("./../../assets/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg")} style={styles.imageStyle} resizeMode="contain" />
                </View>
                <View>
                    <Text style={styles.textStyle}>ID:  {Profile.sid}</Text>
                    <Text style={styles.textStyle}>Name:  {auth.CurrentUser.displayName}</Text>
                    <Text style={styles.textStyle}>Date of Birth: {Profile.date_of_birth}</Text>
                    <Text style={styles.textStyle}>Email: {Profile.email}</Text>
                    <Text style={styles.textStyle}>Address: {Profile.address}</Text>
                    <Button
                    title = ' Delete Account'
                    type = "solid"
                    onPress={()=>{
                      deleteProfile(auth);
                      auth.setIsLoggedIn(false);
                      auth.setCurrentUser({});
                    }
                        
            }
            />

                </View>
            </Card>

        </View>
      )}
    </AuthContext.Consumer>
  );
  
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: "blue",
    alignSelf:"center",
  },
  viewStyle: {
    flex: 1,
  },
  imageStyle:{
    height:200,
    width:200,
    alignSelf:"center",
  },
});

export default ProfileScreen;