import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { configureAudio } from '@/audio/player'
import '../global.css'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GoogleSans: require('../../assets/fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf'),
  })

  useEffect(() => {
    configureAudio()
  }, [])

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#1DB954" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen
          name="player"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />
      </Stack>
    </>
  )
}