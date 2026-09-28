import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { usePlayer } from '@/audio/usePlayer'
import { TrackList } from '@/components/library/TrackList'
import { MiniPlayer } from '@/components/player/MiniPlayer'
import { pickAudioFiles } from '@/library/import'
import { usePlayerStore } from '@/store/player'

export default function Home() {
  const insets = useSafeAreaInsets()

  const tracks = usePlayerStore((state) => state.tracks)
  const addTracks = usePlayerStore((state) => state.addTracks)
  const removeTrack = usePlayerStore(
    (state) => state.removeTrack,
  )

  const setCurrentTrack = usePlayerStore(
    (state) => state.setCurrentTrack,
  )

  const isPlaying = usePlayerStore(
    (state) => state.isPlaying,
  )

  const {
    currentTrack,
    currentTime,
    duration,
    play,
    pause,
    playTrack,
    next,
    previous,
  } = usePlayer()

  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState(false)

  /* ------------------------------------------------------------------------ */
  /* Import                                                                    */
  /* ------------------------------------------------------------------------ */

  async function handleImport() {
    if (isImporting) {
      return
    }

    setIsImporting(true)
    setImportError(false)

    try {
      const files = await pickAudioFiles()

      if (files.length > 0) {
        addTracks(files)
      }
    } catch {
      setImportError(true)
    } finally {
      setIsImporting(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Player                                                                    */
  /* ------------------------------------------------------------------------ */

  function handleTrackPress(track: (typeof tracks)[number]) {
    setCurrentTrack(track)
    router.push('/player')

    setTimeout(() => {
      play()
    }, 100)
  }

  function handleTogglePlay() {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const hasMiniPlayer = !!currentTrack

  const currentTrackIndex = currentTrack
    ? tracks.findIndex(
      (track) => track.id === currentTrack.id,
    )
    : -1

  const hasPrevious = currentTrackIndex > 0

  const hasNext =
    currentTrackIndex >= 0 &&
    currentTrackIndex < tracks.length - 1

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <View className="flex-1 bg-white">
      <View
      className='flex-1'
      >
        {/* Header */}
        <View
          className="px-5 pb-6"
          style={{ paddingTop: insets.top + 20 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-google text-[11px] tracking-[2px] text-[#8A8A8A]">
                OFFLINE PLAYER
              </Text>

              <Text className="mt-1 font-bold text-[32px] leading-[38px] tracking-[-1px] text-[#121212]">
                Sua biblioteca
              </Text>
            </View>

            <Pressable
              onPress={handleImport}
              disabled={isImporting}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Adicionar músicas"
              className="h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F4] active:bg-[#E5E5EA]"
            >
              {isImporting ? (
                <ActivityIndicator
                  color="#000000"
                  size="small"
                />
              ) : (
                <Ionicons
                  name="add"
                  size={24}
                  color="#000000"
                />
              )}
            </Pressable>
          </View>

          <Text className="mt-2 max-w-[290px] font-google text-[15px] leading-[21px] text-[#6E6E73]">
            A tua música, guardada no dispositivo e pronta
            para ouvir.
          </Text>
        </View>

        {/* Import error */}
        {importError && (
          <View className="mx-5 mb-4 flex-row items-center rounded-2xl bg-[#FFF1F0] px-4 py-3.5">
            <Ionicons
              name="alert-circle"
              size={18}
              color="#D93025"
            />

            <Text className="ml-3 flex-1 font-google text-[14px] leading-5 text-[#8A2A20]">
              Não foi possível importar as músicas.
              Tenta novamente.
            </Text>

            <Pressable
              onPress={() => setImportError(false)}
              hitSlop={10}
            >
              <Ionicons
                name="close"
                size={18}
                color="#8A2A20"
              />
            </Pressable>
          </View>
        )}

        {/* Library */}
        {tracks.length > 0 ? (
          <View className="flex-1">
            <TrackList
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTrackPress={handleTrackPress}
              onRemoveTrack={(track) => {
                removeTrack(track.id)
              }}
            />
          </View>
        ) : (
          /* Empty state */
          <View className="items-center px-10 pt-28">

            <Text className="text-center font-bold text-[22px] leading-[28px] tracking-[-0.5px] text-black">
              Sua biblioteca está vazia
            </Text>

            <Text className="mt-2 max-w-[280px] text-center font-google text-[15px] leading-[22px] text-[#6E6E73]">
              Adicione músicas do seu dispositivo para
              começar a ouvir offline.
            </Text>
          </View>
        )}
      </View>

      {/* Mini player */}
      {currentTrack && (
        <MiniPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onPrevious={previous}
          onNext={next}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </View>
  )
}