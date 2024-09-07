import { AntDesign } from "@expo/vector-icons";
import { useSegments,Link } from "expo-router";
import { View,Text,Image,StyleSheet, Pressable } from "react-native";


const EventListItem = ({event}) => {
    const segments = useSegments();
    return (
        <Link href={{
            pathname: `/${segments[0]}/list/${event.id}`,
            params: { event: JSON.stringify(event) }
        }} asChild>
            <Pressable style={styles.listItems}>
                <View>
                    <Image source={{uri:event.image.url}} style={styles.listItemsImage}/>
                </View>
                <View style={styles.listItemsTextContainer}>
                    <Text style={styles.listItemsText}>
                        {event.name}
                    </Text>
                </View>
                <View style={styles.listItemsHeart}>
                        <Text style={styles.listItemsHeartText}>{event.likes_count}</Text>
                        <AntDesign name="heart" size={20} color="#bfbfbf" />
                </View>
            </Pressable>
        </Link>
    )
}

export default EventListItem;

const styles = StyleSheet.create({
    
    listItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        height: 70,
    },
    listItemsTextContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10, 
    },
    listItemsImage:{
        width:70,
        height:70,
    },
    listItemsText: {
        fontSize: 14,
        fontWeight:'bold',
        color:'#3a3a3a',
        marginLeft:10,
        letterSpacing:0.26,
        textAlign: 'left', 
    },
    listItemsHeart: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginRight:18,
    },
    listItemsHeartText: {
        color:'#bfbfbf',
        fontSize: 14,
        marginRight:3,
        letterSpacing:0.26,
    }
})  