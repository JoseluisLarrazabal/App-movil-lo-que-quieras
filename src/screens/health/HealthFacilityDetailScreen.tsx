import React from "react";
import { StyleSheet, View, Linking } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Title, Button, Paragraph } from "react-native-paper";
import type { RootState } from "../../redux/store";
import { theme } from "../../theme";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Helper para íconos y colores por tipo
const typeMeta = {
  hospital: { icon: 'hospital-building', color: '#10B981' },
  clinic: { icon: 'medical-bag', color: '#3B82F6' },
  pharmacy: { icon: 'pill', color: '#F59E0B' },
  laboratory: { icon: 'flask', color: '#8B5CF6' },
  dentist: { icon: 'tooth', color: '#EC4899' },
  default: { icon: 'map-marker', color: theme.colors.primary },
};

export default function HealthFacilityDetailScreen({ route }: any) {
  const { id } = route.params;
  const facility = useSelector((state: RootState) => state.healthFacilities.items.find(f => f._id === id));
  const [userLocation, setUserLocation] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado');
          return;
        }
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (e) {
        setLocationError('No se pudo obtener la ubicación');
      }
    })();
  }, []);

  if (!facility) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>No encontrado</Text></View>;

  const meta = (facility.type in typeMeta)
    ? typeMeta[facility.type as keyof typeof typeMeta]
    : typeMeta.default;
  const is24h = (facility.openingHours || '').includes('24');

  const openMaps = () => {
    const url = `https://www.openstreetmap.org/?mlat=${facility.location.lat}&mlon=${facility.location.lng}#map=18/${facility.location.lat}/${facility.location.lng}`;
    Linking.openURL(url);
  };

  const callPhone = () => {
    if (facility.contact?.phone) {
      Linking.openURL(`tel:${facility.contact.phone}`);
    }
  };

  const openWhatsApp = () => {
    if (facility.contact?.phone) {
      const phone = facility.contact.phone.replace(/[^\d+]/g, '');
      const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent('Hola, me gustaría consultar sobre su establecimiento de salud.')}`;
      Linking.openURL(url).catch(() => {
        alert('No se pudo abrir WhatsApp');
      });
    }
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${facility.location.lat},${facility.location.lng}`;
    Linking.openURL(url);
  };

  const openDirections = () => {
    if (!userLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${facility.location.lat},${facility.location.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={[styles.card, { borderLeftWidth: 8, borderLeftColor: meta.color }]}> 
        <Card.Content>
          <View style={styles.headerRow}>
            <MaterialCommunityIcons name={meta.icon as any} size={40} color={meta.color} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Title style={styles.title}>{facility.name}</Title>
              <View style={styles.typeRow}>
                <Text style={[styles.type, { color: meta.color }]}>{facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}</Text>
                {is24h && <Text style={styles.badge24h}>24h</Text>}
              </View>
              <Text style={styles.city}>{facility.city}</Text>
            </View>
          </View>
          <Paragraph style={styles.address}>{facility.address}</Paragraph>
          <Paragraph style={styles.sectionLabel}>Servicios:</Paragraph>
          <Paragraph>{facility.services?.length ? facility.services.join(", ") : 'No especificados'}</Paragraph>
          <Paragraph style={styles.sectionLabel}>Horario:</Paragraph>
          <Paragraph>{facility.openingHours || 'No especificado'}</Paragraph>
          <Paragraph style={styles.sectionLabel}>Teléfono:</Paragraph>
          <Paragraph>{facility.contact?.phone || 'No disponible'}</Paragraph>
          {facility.contact?.website && <Paragraph style={styles.sectionLabel}>Web: {facility.contact.website}</Paragraph>}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <View style={styles.rowButtons}>
            <Button mode="contained" icon="google-maps" onPress={openGoogleMaps} style={styles.actionButton} contentStyle={styles.buttonContent}>Google Maps</Button>
            <Button mode="contained" icon="navigation" onPress={openDirections} style={styles.actionButton} contentStyle={styles.buttonContent} disabled={!userLocation}>Cómo llegar</Button>
          </View>
          {(facility.contact?.phone) && (
            <View style={styles.rowButtons}>
              {facility.contact?.phone && (
                <Button mode="outlined" icon="whatsapp" onPress={openWhatsApp} style={styles.actionButton} contentStyle={styles.buttonContent}>WhatsApp</Button>
              )}
            </View>
          )}
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: "center" },
  card: { margin: 16, borderRadius: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge24h: { backgroundColor: '#10B981', color: 'white', fontSize: 10, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 2 },
  type: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  city: { fontSize: 13, color: theme.colors.placeholder, marginBottom: 2 },
  address: { fontSize: 14, color: theme.colors.placeholder, marginBottom: 8 },
  sectionLabel: { fontWeight: 'bold', marginTop: 8 },
  actions: { flexDirection: 'column', justifyContent: 'center', marginBottom: 16, gap: 12 },
  rowButtons: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  actionButton: { borderRadius: 8, marginHorizontal: 0, flex: 1, minWidth: 0 },
  buttonContent: { height: 44 },
}); 