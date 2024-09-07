import { FlatList, Image, StyleSheet, Text, View, ViewBase } from 'react-native';
import { getListItems } from '@/src/api/get-items';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import listIcon from '@/assets/icons/list.png';
import EventListItem from '@/src/components/EventListItem';


export default function ListScreen() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getListItems();
      const parsedEvents = JSON.parse(fetchedEvents);
      setEvents(parsedEvents.pois);
    };
    fetchEvents();
  }, []);

  return (
      <View style={styles.container}>
        <View style={styles.header}> 
            <View style={styles.headerLeft}>
                <Text style={styles.headerText}>LATINA - ÓPERA</Text>
                <View style={styles.headerLocation}>
                    <FontAwesome name="map-marker" color="white"size={22}/>
                    <Text style={styles.headerTextLocation}>118</Text>
                </View>
            </View>
            <View style={styles.headerRight}>
                <Image source={listIcon} style={styles.headerIcon}/>
            </View>
        </View>
        <View style={styles.headerSort}>
            <Text style={styles.headerSortText}>Ordenar: 
                <Text style={styles.headerSortTextPopularidad}> Popularidad</Text>
            </Text>
            <Entypo name="dots-three-horizontal" size={24} color="white" />
        </View>
        <FlatList 
            data={events}
            renderItem={({item})=><EventListItem event={item}/>} 
            contentContainerStyle={{gap:1}}
            />  
        
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        margin: 0,
    },
    header: {
        flexDirection:'row',
        justifyContent:'space-between',
        height:50,
    },
    headerText: {
        color: 'white',
        fontSize: 24.75,
        fontWeight: 'bold',
        letterSpacing:0.69,
    },
    headerRight: {
        width:50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'black',
    },
    headerIcon: {
        width:25,
        height:25,
        resizeMode:'contain',
    },
    headerLeft: {
        width:'88%',
        paddingLeft:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#3a3a3a',
    },
    
    headerLocation: {
        flexDirection:'row',
        alignItems:'center',
    },
    headerTextLocation: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing:0.63,
        marginRight:18,
        marginLeft:5,
    },
    headerSort: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#202020',
        paddingRight:13,
        paddingLeft:15,
        height:50,
    },
    headerSortText: {
        color: '#cccccc',
        fontSize: 16,
        letterSpacing:0.3,
        marginRight:18,
        marginLeft:5,
    },
    headerSortTextPopularidad: {
        color: '#cccccc',
        fontSize: 16,
        fontWeight:'bold',
        letterSpacing:0.3,
    }
});