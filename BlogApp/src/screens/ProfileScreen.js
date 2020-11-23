import React, { useState } from "react";
import { View, StyleSheet, AsyncStorage, Image} from "react-native";
import { Text, Card, Button, Avatar } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import HeaderHome from "../components/HeaderComponent";
import { removeData } from "../functions/AsyncStorageFunctions"; 
const ProfileScreen = (props) => {
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
                    <Text style={styles.textStyle}>ID:  {auth.CurrentUser.sid}</Text>
                    <Text style={styles.textStyle}>Name:  {auth.CurrentUser.name}</Text>
                    <Text style={styles.textStyle}>Date of Birth: {auth.CurrentUser.bod}</Text>
                    <Text style={styles.textStyle}>Email: {auth.CurrentUser.email}</Text>
                    <Text style={styles.textStyle}>Address: {auth.CurrentUser.address}</Text>
                    <Button
                    title = ' Delete Account'
                    type = "solid"
                    onPress={
                        async function(){
                            await removeData(auth.CurrentUser.sid);
                             auth.setIsLoggedIn(false);
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