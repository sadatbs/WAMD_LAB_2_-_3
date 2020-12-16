import React from "react";
import { Button, Input } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { View } from "react-native";

const InputCard = (props) => {
  return (
    <View>
      <Input
        placeholder={props.placeHolder}
        leftIcon={<Entypo name="pencil" size={24} color="dodgerblue" />}
        onChangeText={(currentText) => {
          props.currentFunc(currentText);
        }}
      />
      <Button title="Post" type="outline" onPress={props.pressFunction} />
    </View>
  );
};

export default InputCard;