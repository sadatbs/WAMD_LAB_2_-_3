import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Input, Button, Card } from "react-native-elements";
import { FontAwesome, Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { storeDataJSON } from "../functions/AsyncStorageFunctions";
import * as firebase from "firebase";
import 'firebase/firestore';

const SignUpScreen = (props) => {
  const [Name, setName] = useState("");
  const [SID, setSID] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [DOB, setDOB]=useState("");
  const [Address, setAddress]=useState("");

  return (
    <View style={styles.viewStyle}>
      <ImageBackground source={require("../../assets/wzuNYC.jpg")} style={styles.image}>
      <Card opacity={0.8}>
        <Card.Title>Local Blog</Card.Title>
        <Card.Divider />
        <Input
          leftIcon={<Ionicons name="ios-person" size={24} color="brown" />}
          placeholder="Name"
          onChangeText={function (currentInput) {
            setName(currentInput);
          }}
        />
        <Input
          leftIcon={<Ionicons name="ios-school" size={24} color="brown" />}
          placeholder="Student ID"
          onChangeText={function (currentInput) {
            setSID(currentInput);
          }}
        />
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

            <Input
              placeholder="Date of Birth"
              leftIcon={<FontAwesome name="calendar" size={24} color="brown" />}
              onChangeText={function (currentInput) {
                setDOB(currentInput);
              }}
            />

            <Input
              placeholder="Address"
              leftIcon={<FontAwesome name="address-card" size={24} color="brown" />}
              onChangeText={function (currentInput) {
                setAddress(currentInput);
              }}
            />

        <Button
          icon={<AntDesign name="user" size={24} color="dodgerblue" />}
          title="Sign Up!"
          type="outline"
          onPress={()=>{
            if(Name && SID && Email && Password && DOB && Address)
            {
              firebase
                  .auth()
                  .createUserWithEmailAndPassword(Email, Password)
                  .then((userCreds) => {
                    userCreds.user.updateProfile({ displayName: Name });
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(userCreds.user.uid)
                      .set({
                        name: Name,
                        sid: SID,
                        email: Email,
                        date_of_birth: DOB,
                        address : Address
                      })
                      .then(() => {
                        
                        alert(userCreds.user.uid);
                        console.log(userCreds.user);
                        props.navigation.navigate("SignIn");
                      })
                      .catch((error) => {
                        
                        alert(error);
                      });
                  })
                  .catch((error) => {
                   
                    alert(error);
                  });
              } else {
                alert("Fields can not be empty!");
              }
            }}
        />
        <Button
          type="outline"
          icon={<AntDesign name="login" size={24} color="dodgerblue" />}
          title="  Already have an account?"
          onPress={function () {
            props.navigation.navigate("SignIn");
          }}
        />
      </Card>
      </ImageBackground>
    </View>
  );
};

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
export default SignUpScreen;