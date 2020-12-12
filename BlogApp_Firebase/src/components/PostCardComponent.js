import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Avatar } from "react-native-elements";

const PostCard = (props) => {

  return (
    <Card containerStyle={styles.card__today}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          height:8,
        }}
      >
        <Avatar
          containerStyle={{ backgroundColor: "rgb(  250, 250, 250  )" }}
          rounded
          icon={{ name: "user", type: "font-awesome", color: "black" }}
          activeOpacity={1}
        />
        <Text h3Style={{fontSize: 15}} h3 >
          {props.author}
        </Text>
      </View>
      <Text style={{ fontStyle: "italic" }}> {props.title}</Text>
      <Text
        style={{
          paddingVertical: 10,
        }}
      >
        {props.body}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card__today: {
    display: "flex",
    flexDirection: "column", 
    backgroundColor: "rgb( 234, 234, 234 )"
},
});

export default PostCard;