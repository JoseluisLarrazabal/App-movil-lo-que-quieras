import React, { useState } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import MapView, { Marker, MapPressEvent } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Title, Text } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { theme } from '../../theme'
import * as Location from 'expo-location'

const screen = Dimensions.get('window')

export default function SelectLocationScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const initialLocation = route.params?.initialLocation || { lat: -17.3895, lng: -66.1568 }
  const [marker, setMarker] = useState({
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
  })
  const [region, setRegion] = useState({
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado')
          setLoading(false)
          return
        }
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low })
        setMarker({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
        setRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 })
      } catch (e) {
        setLocationError('No se pudo obtener la ubicación')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleMapPress = (e: MapPressEvent) => {
    setMarker(e.nativeEvent.coordinate)
  }

  const handleConfirm = () => {
    if (route.params?.onLocationSelected) {
      route.params.onLocationSelected({ lat: marker.latitude, lng: marker.longitude })
    }
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Selecciona la ubicación del comercio</Title>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Cargando mapa...</Text></View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={region}
          region={region}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={e => setMarker(e.nativeEvent.coordinate)}
          />
        </MapView>
      )}
      <View style={styles.infoRow}>
        <Text>Lat: {marker.latitude.toFixed(5)}  Lng: {marker.longitude.toFixed(5)}</Text>
      </View>
      <Button mode="contained" style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
        Confirmar ubicación
      </Button>
      {locationError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{locationError}</Text>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 18, fontWeight: 'bold', margin: 16, textAlign: 'center' },
  map: { width: screen.width, height: screen.height * 0.6 },
  infoRow: { alignItems: 'center', marginVertical: 12 },
  confirmButton: { marginHorizontal: 24, borderRadius: 12 },
}) 