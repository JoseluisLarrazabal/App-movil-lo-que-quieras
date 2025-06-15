import React from "react";
import { StyleSheet, View, Linking, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Title, Button, Paragraph, Chip } from "react-native-paper";
import type { RootState } from "../../redux/store";
import { theme } from "../../theme";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const typeMeta = {
  barrio: { icon: 'storefront', color: '#10B981' },
  supermercado: { icon: 'cart', color: '#3B82F6' },
  minimarket: { icon: 'shopping-outline', color: '#F59E0B' },
  mercado: { icon: 'basket', color: '#8B5CF6' },
  otro: { icon: 'store', color: theme.colors.primary },
  default: { icon: 'map-marker', color: theme.colors.primary },
};

export default function CommerceDetailScreen({ route }: any) {
  const { id } = route.params;
  const store = useSelector((state: RootState) => (state as any).localStores.items.find((f: any) => f._id === id));
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

  if (!store) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>No encontrado</Text></View>;

  const meta = (store.type in typeMeta)
    ? typeMeta[store.type as keyof typeof typeMeta]
    : typeMeta.default;

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.location.lat},${store.location.lng}`;
    Linking.openURL(url);
  };

  const openDirections = () => {
    if (!userLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${store.location.lat},${store.location.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  const openWhatsApp = () => {
    if (store.contact?.whatsapp) {
      const phone = store.contact.whatsapp.replace(/[^\d+]/g, '');
      const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent('Hola, me gustaría consultar sobre su comercio.')}`;
      Linking.openURL(url).catch(() => {
        alert('No se pudo abrir WhatsApp');
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={[styles.card, { borderLeftWidth: 8, borderLeftColor: meta.color }]}> 
          {store.images?.[0] && (
            <Image source={{ uri: store.images[0] }} style={styles.image} resizeMode="cover" />
          )}
          <Card.Content>
            <View style={styles.headerRow}>
              <MaterialCommunityIcons name={meta.icon as any} size={40} color={meta.color} style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Title style={styles.title}>{store.name}</Title>
                <View style={styles.typeRow}>
                  <Text style={[styles.type, { color: meta.color }]}>{store.type.charAt(0).toUpperCase() + store.type.slice(1)}</Text>
                  <Text style={styles.city}>{store.city}</Text>
                </View>
              </View>
            </View>
            <Paragraph style={styles.address}>{store.address}</Paragraph>
            {store.description && <Paragraph style={styles.description}>{store.description}</Paragraph>}
            <Paragraph style={styles.sectionLabel}>Servicios:</Paragraph>
            <View style={styles.servicesRow}>
              {store.services?.length ? store.services.map((s: string, i: number) => (
                <Chip key={i} style={styles.serviceChip}>{s}</Chip>
              )) : <Text style={styles.noServices}>No especificados</Text>}
            </View>
            <Paragraph style={styles.sectionLabel}>Horario:</Paragraph>
            <Paragraph>{store.openingHours || 'No especificado'}</Paragraph>
            <Paragraph style={styles.sectionLabel}>Teléfono:</Paragraph>
            <Paragraph>{store.contact?.phone || 'No disponible'}</Paragraph>
            {store.contact?.website && <Paragraph style={styles.sectionLabel}>Web: {store.contact.website}</Paragraph>}
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <View style={styles.rowButtons}>
              <Button mode="contained" icon="google-maps" onPress={openGoogleMaps} style={styles.actionButton} contentStyle={styles.buttonContent}>Google Maps</Button>
              <Button mode="contained" icon="navigation" onPress={openDirections} style={styles.actionButton} contentStyle={styles.buttonContent} disabled={!userLocation}>Cómo llegar</Button>
            </View>
            {store.contact?.whatsapp && (
              <View style={styles.rowButtons}>
                <Button mode="outlined" icon="whatsapp" onPress={openWhatsApp} style={styles.actionButton} contentStyle={styles.buttonContent}>WhatsApp</Button>
              </View>
            )}
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: "center" },
  card: { margin: 16, borderRadius: 16 },
  image: { width: "100%", height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 2 },
  type: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  city: { fontSize: 13, color: theme.colors.placeholder, marginLeft: 8 },
  address: { fontSize: 14, color: theme.colors.placeholder, marginBottom: 8 },
  description: { fontSize: 14, color: theme.colors.text, marginBottom: 8 },
  sectionLabel: { fontWeight: 'bold', marginTop: 8 },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  serviceChip: { marginRight: 4, marginBottom: 4, backgroundColor: theme.colors.surface },
  noServices: { color: theme.colors.placeholder },
  actions: { flexDirection: 'column', justifyContent: 'center', marginBottom: 16, gap: 12 },
  rowButtons: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  actionButton: { borderRadius: 8, marginHorizontal: 0, flex: 1, minWidth: 0 },
  buttonContent: { height: 44 },
}); 