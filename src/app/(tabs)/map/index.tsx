import { getListItems } from "@/src/api/get-items";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import listIcon from "@/assets/icons/list.png";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Callout } from "react-native-maps";

const CustomCallout = ({ event }) => (
  <View style={styles.calloutContainer}>
    <Text style={styles.calloutTitle}>{event.name || 'Evento sin nombre'}</Text>
    <View style={styles.calloutDetails}>
      <FontAwesome name="calendar" size={16} color="#f35412" />
      <Text style={styles.calloutDate}>{event.date || 'Fecha no disponible'}</Text>
    </View>
    <View style={styles.calloutDetails}>
      <FontAwesome name="map-marker" size={16} color="#f35412" />
      <Text style={styles.calloutLocation}>{event.location || 'Ubicación no disponible'}</Text>
    </View>
  </View>
);

export default function MapScreen() {
  const [coordinates, setCoordinates] = useState([]);
  const [region, setRegion] = useState({
    latitude: 40.4168, // Default latitude (adjust as needed)
    longitude: -3.7038, // Default longitude (adjust as needed)
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getListItems();
        const parsedEvents = JSON.parse(fetchedEvents);
        setEvents(parsedEvents.pois);
        if (parsedEvents.coordinates) {
          const coords = parsedEvents.coordinates.split(" ").map((coord) => {
            const [longitude, latitude] = coord.split(",");
            return {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            };
          });
          if (coords.length > 0) {
            setCoordinates(coords);
            // Update region to center on the first coordinate
            setRegion((prev) => ({
              ...prev,
              latitude: coords[0].latitude,
              longitude: coords[0].longitude,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []); // Asegúrate de que este array de dependencias esté presente

  const validCoordinates = coordinates.filter(coord => 
    typeof coord.latitude === 'number' && 
    typeof coord.longitude === 'number' &&
    !isNaN(coord.latitude) && 
    !isNaN(coord.longitude)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>LATINA - ÓPERA</Text>
          <View style={styles.headerLocation}>
            <FontAwesome name="map-marker" color="white" size={22} />
            <Text style={styles.headerTextLocation}>118</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Image source={listIcon} style={styles.headerIcon} />
        </View>
      </View>
      <View style={styles.mapContainer}>
        {events.length > 0 && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {validCoordinates.length > 2 && (
              <Polygon
                coordinates={validCoordinates}
                fillColor="rgba(255,0,0,0.2)"
                strokeColor="rgba(255,0,0,0.5)"
                strokeWidth={2}
              />
            )}
            {events.map((event, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: event.latitude || 0,
                  longitude: event.longitude || 0
                }}
              >
                {event.category &&
                event.category.marker &&
                event.category.marker.url ? (
                  <Image
                    source={{ uri: event.category.marker.url }}
                    style={{ width: 40, height: 40, resizeMode: "contain" }}
                  />
                ) : (
                  <FontAwesome name="map-marker" size={40} color="red" />
                )}
                <Callout>
                  <CustomCallout event={event} />
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
  },
  headerText: {
    color: "white",
    fontSize: 24.75,
    fontWeight: "bold",
    letterSpacing: 0.69,
  },
  headerRight: {
    width: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f35412",
  },
  headerIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  headerLeft: {
    width: "88%",
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3a3a3a",
  },

  headerLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextLocation: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.63,
    marginRight: 18,
    marginLeft: 5,
  },
  mapContainer: {
    height: "100%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: 'black',
  },
  calloutTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  calloutDate: {
    color: 'white',
    marginLeft: 5,
  },
  calloutLocation: {
    color: 'white',
    marginLeft: 5,
  },
});
