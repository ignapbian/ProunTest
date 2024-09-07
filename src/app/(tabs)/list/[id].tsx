import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { event } = useLocalSearchParams();
  const eventData = event ? JSON.parse(event) : null;
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const events = [
    { id: '1', date: '07', month: 'ABR', title: 'Metronomy en Concierto', time: '7 de abril a las 22:00' },
    { id: '2', date: '23', month: 'ABR', title: 'Mago de Oz en Concierto', time: '23 de abril a las 22:00' },
    { id: '3', date: '23', month: 'MAY', title: 'Mission of Burma en Concierto', time: '23 de mayo a las 22:00' },
  ];

  const EventItem = ({ date, month, title, time }) => (
    <View style={styles.eventItem}>
      <View style={styles.dateCircle}>
        <Text style={styles.dateNumber}>{date}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventTime}>{time}</Text>
      </View>
    </View>
  );

  async function playSound() {
    if (!eventData || !eventData.audio) {
      console.error("No audio file available");
      return;
    }

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: eventData.audio.url },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error playing sound: ", error);
    }
  }

  function onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
    }
  }

  function formatTime(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const renderGalleryItem = ({ item }) => (
    <Image
      source={{ uri: item.url }}
      style={styles.galleryImage}
      resizeMode="cover"
    />
  );

  return (
    <View style={styles.container}>
         <Stack.Screen options={{title:'MADRID'}} />
      <ScrollView style={styles.subContainer}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {eventData.category && eventData.category.icon && (
              <Image
                source={{ uri: eventData.category.icon.url }}
                style={styles.categoryIcon}
              />
            )}
            <Text style={styles.textHeader}>{eventData.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              /* Handle close action */
            }}
          >
            <Ionicons name="close" size={45} color="#d8d8d8" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={eventData.gallery_images}
          renderItem={renderGalleryItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        />

        <View style={styles.audioSection}>
          <TouchableOpacity onPress={playSound} style={styles.playButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="#666666"
            />
          </TouchableOpacity>
          <View style={styles.audioControls}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={async (value) => {
                if (sound) {
                  await sound.setPositionAsync(value);
                }
              }}
              minimumTrackTintColor="#666666"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#666666"
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionHeaderContainer}>
            <Text style={styles.descriptionTextHeader}>
              Acerca de este local:
            </Text>
            <View style={styles.likesContainer}>
              <Text style={styles.likesCount}>{eventData.likes_count}</Text>
              <AntDesign name="heart" size={20} color="#bfbfbf" />
            </View>
          </View>
          <Text style={styles.descriptionText}>{eventData.description}</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: eventData.latitude,
              longitude: eventData.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: eventData.latitude,
                longitude: eventData.longitude,
              }}
              title={eventData.name}
            >
              <Image
                source={{ uri: eventData.category.marker.url }}
                style={{ width: 40, height: 40,resizeMode:'contain' }}
              />
            </Marker>
          </MapView>
        </View>
        <View style={styles.eventsSection}>
          <View style={styles.tabsContainer}>
            <View style={styles.tabWrapper}>
              <Text style={[styles.tabText, styles.activeTab]}>EVENTOS</Text>
              <View style={styles.activeTabIndicator} />
            </View>
            <View style={styles.tabWrapper}>
              <Text style={styles.tabText}>ACTUALIDAD</Text>
            </View>
          </View>
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <EventItem
                date={item.date}
                month={item.month}
                title={item.title}
                time={item.time}
              />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  subContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    height: "auto", 
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#979797",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50, // Reduce la altura del header
    borderBottomWidth: 1,
    borderBottomColor: "#979797",
    paddingHorizontal: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  textHeader: {
    color: "#666666",
    fontSize: 20,
    marginLeft: 10,
  },
  closeButton: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: 44,
  },
  carousel: {
    height: 200, // Ajusta esta altura según sea necesario
  },
  galleryImage: {
    width: Dimensions.get("window").width * 0.9, // Ajusta al ancho del subContainer
    height: 200, // Ajusta esta altura para que coincida con el carousel
    marginRight: 0,
  },
  audioSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  playButton: {
    marginRight: 10,
  },
  audioControls: {
    flex: 1,
  },
  slider: {
    width: "100%",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  timeText: {
    color: "#666666",
    fontSize: 12,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#eeeeee",
    marginVertical: 10,
  },
  descriptionContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  descriptionText: {
    color: "#666666",
    fontSize: 12,
  },
  descriptionTextHeader: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "bold",
  },
  descriptionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCount: {
    color: "#bfbfbf",
    fontSize: 14,
    marginRight: 3,
    letterSpacing: 0.26,
  },
  mapContainer: {
    height: 200,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 13,
  },
  map: {
    flex: 1,
  },
  eventsSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCCCCC',
    paddingBottom: 5,
  },
  activeTab: {
    color: '#000000',
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: '#FF6600',
    width: '50%',
    alignSelf: 'center',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: 'white',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
  },
});

