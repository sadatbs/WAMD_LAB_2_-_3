import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { Input, Button, Card } from "react-native-elements";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import { getDataJSON } from "../functions/AsyncStorageFunctions";
import * as firebase from 'firebase';
import 'firebase/firestore';

const SignInScreen = (props) => {
  
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  

  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle} opacity={1}>
          <ImageBackground source={require("../../assets/wzuNYC.jpg")} style={styles.image}>
          <Card  opacity={0.8}>
            <Card.Title >Local Blog</Card.Title>
            <Card.Divider />
            <Input
              leftIcon={<FontAwesome name="envelope" size={24} color="brown" />}
              placeholder="E-mail Address"
              onChangeText={function (currentInput) {
                setEmail(currentInput);
              }}
            />

            <Input
              placeholder="Password"
              leftIcon={<Feather name="key" size={24} color="brown" />}
              secureTextEntry={true}
              onChangeText={function (currentInput) {
                setPassword(currentInput);
              }}
            />

            <Button
              icon={<AntDesign name="login" size={24} color="dodgerblue" />}
              title=" Sign In!"
              type="outline"
              onPress={() => {
                
                firebase
                  .auth()
                  .signInWithEmailAndPassword(Email, Password)
                  .then((userCreds) => {
                    
                    auth.setIsLoggedIn(true);
                    auth.setCurrentUser(userCreds.user);
                  })
                  .catch((error) => {
                    
                    alert(error);
                  });
              }}
            />
            <Button
              type="outline"
              icon={<AntDesign name="user" size={24} color="dodgerblue" />}
              title="  Don't have an account?"
              onPress={function () {
                props.navigation.navigate("SignUp");
              }}
            />
          </Card>
          </ImageBackground>
        </View>
      )}
    </AuthContext.Consumer>
  );
};
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#4bacb8",
  },
  image: {
    flex: 1,
    resizeMode:"cover",
    justifyContent: "center"
  },
});
export default SignInScreen;