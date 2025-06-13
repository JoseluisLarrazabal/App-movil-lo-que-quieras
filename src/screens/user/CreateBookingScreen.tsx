import React, { useState, useContext } from "react"
import { StyleSheet, View, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Text, Button, TextInput, Title, HelperText } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../../theme"
import { createBooking } from "../../redux/slices/bookingsSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { AuthContext } from "../../context/AuthContext"

export default function CreateBookingScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()
  const route = useRoute()
  const { currentUser } = useContext(AuthContext)
  const { status, error } = useSelector((state: RootState) => state.bookings)

  // Recibe serviceId por params
  const { serviceId } = route.params as { serviceId: string }

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [dateError, setDateError] = useState("")
  const [timeError, setTimeError] = useState("")

  const validateDate = (dateStr: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateStr)) {
      setDateError("Formato de fecha inválido. Use YYYY-MM-DD")
      return false
    }
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      setDateError("Fecha inválida")
      return false
    }
    if (date < new Date()) {
      setDateError("La fecha debe ser futura")
      return false
    }
    setDateError("")
    return true
  }

  const validateTime = (timeStr: string) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(timeStr)) {
      setTimeError("Formato de hora inválido. Use HH:MM")
      return false
    }
    setTimeError("")
    return true
  }

  const handleCreateBooking = async () => {
    // Validar campos
    const isDateValid = validateDate(date)
    const isTimeValid = validateTime(time)

    if (!isDateValid || !isTimeValid) {
      return
    }

    setSubmitting(true)
    try {
      const result = await dispatch(createBooking({
        serviceId,
        scheduledDate: date,
        scheduledTime: time,
        notes
      }))
      
      if (createBooking.fulfilled.match(result)) {
        Alert.alert(
          "Reserva creada", 
          "Tu reserva fue enviada y está pendiente de confirmación.", 
          [
            { 
              text: "Ver mis reservas", 
              onPress: () => navigation.navigate("Bookings" as never) 
            }
          ]
        )
      } else {
        Alert.alert(
          "Error", 
          result.payload?.message || "No se pudo crear la reserva"
        )
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo crear la reserva")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Reservar servicio</Title>
      <View style={styles.form}>
        <TextInput
          label="Fecha (YYYY-MM-DD)"
          value={date}
          onChangeText={(text) => {
            setDate(text)
            validateDate(text)
          }}
          style={styles.input}
          placeholder="2024-07-01"
          error={!!dateError}
        />
        {dateError ? <HelperText type="error">{dateError}</HelperText> : null}

        <TextInput
          label="Hora (HH:MM)"
          value={time}
          onChangeText={(text) => {
            setTime(text)
            validateTime(text)
          }}
          style={styles.input}
          placeholder="15:00"
          error={!!timeError}
        />
        {timeError ? <HelperText type="error">{timeError}</HelperText> : null}

        <TextInput
          label="Notas (opcional)"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          multiline
        />
        
        {status === "failed" && !!error && (
          <HelperText type="error">{error}</HelperText>
        )}
        
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleCreateBooking}
          loading={submitting}
          disabled={submitting || !!dateError || !!timeError}
        >
          Reservar
        </Button>
        
        <Button 
          mode="text" 
          onPress={() => navigation.goBack()} 
          style={styles.cancelButton}
        >
          Cancelar
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colors.text,
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
  },
  cancelButton: {
    marginTop: 8,
  },
}) 