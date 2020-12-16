import React from "react";
import { View} from "react-native";
import { Card, Text, Avatar } from "react-native-elements";

const CommentCard = (props) =>{
    return (
        <Card>
            <View
                style={{
                    flexDirection: "column",
                }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 10
                    }}
                >
                    <Avatar
                        containerStyle={{ backgroundColor: 'lightblue'}}
                        rounded
                        size={25}
                        icon={{ name: "user", type: "font-awesome", color: "dodgerblue" }}
                        activeOpacity={1}
                    />
                    <Text h4Style={{ fontSize: 13, paddingHorizontal: 10}} h4>{props.commentor}</Text>
                </View>
                <Card.Divider></Card.Divider>
                <Text Style={{ marginTop: 30 }}>{props.comment}</Text>
            </View>
        </Card>
    );
};


export default CommentCard;