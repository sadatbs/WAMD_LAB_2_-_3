import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import AuthStackScreen from "./src/Navigation/AuthStack";
import AppDrawerScreen from "./src/Navigation/Appdrawer";
import { AuthContext, AuthProvider } from "./src/providers/AuthProvider";
import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyD3ULgQc35e36j3G0q4BQvqMN8P3nLOOkM",
    authDomain: "blogappfirebase-9881b.firebaseapp.com",
    projectId: "blogappfirebase-9881b",
    storageBucket: "blogappfirebase-9881b.appspot.com",
    messagingSenderId: "338076938623",
    appId: "1:338076938623:web:6bc55099f2509de95fea4a"
  };
  if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
  }

function App()
{
  return (

    <AuthProvider>
      <AuthContext.Consumer>
          {(auth) => (
            <NavigationContainer>
              {auth.IsLoggedIn ? <AppDrawerScreen /> :
              <AuthStackScreen />}
            </NavigationContainer>
          )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;