import React from "react";
import { StyleSheet, View, Linking } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Title, Button, Paragraph } from "react-native-paper";
import type { RootState } from "../../redux/store";
import { theme } from "../../theme";

export default function HealthFacilityDetailScreen({ route }: any) {
  const { id } = route.params;
  const facility = useSelector((state: RootState) => state.healthFacilities.items.find(f => f._id === id));
  if (!facility) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>No encontrado</Text></View>;

  const openMaps = () => {
    const url = `https://www.openstreetmap.org/?mlat=${facility.location.lat}&mlon=${facility.location.lng}#map=18/${facility.location.lat}/${facility.location.lng}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{facility.name}</Title>
          <Text style={styles.type}>{facility.type}</Text>
          <Paragraph style={styles.address}>{facility.address}, {facility.city}</Paragraph>
          <Paragraph>Servicios: {facility.services?.join(", ")}</Paragraph>
          <Paragraph>Horario: {facility.openingHours}</Paragraph>
          <Paragraph>Teléfono: {facility.contact?.phone}</Paragraph>
          {facility.contact?.website && <Paragraph>Web: {facility.contact.website}</Paragraph>}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={openMaps}>Ver en mapa</Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: "center" },
  card: { margin: 16, borderRadius: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  type: { fontSize: 16, color: theme.colors.primary, marginBottom: 4 },
  address: { fontSize: 14, color: theme.colors.placeholder, marginBottom: 8 },
}); 