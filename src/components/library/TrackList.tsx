import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import type { Track } from '@/types/music'

type TrackListProps = {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  onTrackPress: (track: Track) => void
  onRemoveTrack?: (track: Track) => void
}

function Equalizer() {
  const bars = [
    useRef(new Animated.Value(0.35)).current,
    useRef(new Animated.Value(0.7)).current,
    useRef(new Animated.Value(0.45)).current,
  ]

  useEffect(() => {
    const animations = bars.map((bar, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: index === 1 ? 1 : 0.75,
            duration: 300 + index * 80,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 0.25,
            duration: 300 + index * 80,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    )

    animations.forEach((animation) => animation.start())

    return () => {
      animations.forEach((animation) => animation.stop())
    }
  }, [bars])

  return (
    <View className="h-4 w-4 flex-row items-end justify-center gap-[2px]">
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          className="w-[2px] rounded-full bg-white"
          style={{
            height: 12,
            transform: [{ scaleY: bar }],
          }}
        />
      ))}
    </View>
  )
}

const TONES = ['#F1F1F3', '#F1F1F3', '#F1F1F3', '#F1F1F3']

function toneFor(track: Track) {
  const value =
    track.id
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    TONES.length

  return TONES[value]
}

function Artwork({
  track,
  isCurrent,
  isPlaying,
}: {
  track: Track
  isCurrent: boolean
  isPlaying: boolean
}) {
  const backgroundColor = toneFor(track)

  return (
    <View
      className="relative h-14 w-14 overflow-hidden rounded-[12px]"
      style={{ backgroundColor }}
    >
      <View className="flex-1 items-center justify-center">
        <Ionicons
          name="musical-notes"
          size={23}
          color="#A1A1A6"
        />
      </View>

      {isCurrent && (
        <View className="absolute inset-0 items-center justify-center bg-black/35">
          {isPlaying ? (
            <Equalizer />
          ) : (
            <Ionicons
              name="pause"
              size={18}
              color="white"
            />
          )}
        </View>
      )}
    </View>
  )
}

function TrackMenu({
  track,
  onRemove,
  onClose,
}: {
  track: Track
  onRemove: () => void
  onClose: () => void
}) {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.94)).current
  const translateY = useRef(new Animated.Value(14)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        speed: 22,
        bounciness: 3,
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 22,
        bounciness: 3,
        useNativeDriver: true,
      }),
    ]).start()
  }, [opacity, scale, translateY])

  function closeMenu(callback?: () => void) {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 0.96,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 12,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.()
    })
  }

  function handleRemove() {
    closeMenu(onRemove)
  }

  function handleClose() {
    closeMenu(onClose)
  }

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View className="flex-1" pointerEvents="box-none">
        {/* Background */}
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 bg-black/20"
          style={{
            opacity,
          }}
        />

        {/* Close when tapping outside */}
        <Pressable
          onPress={handleClose}
          className="absolute inset-0"
        />

        {/* Menu */}
        <Animated.View
          className="absolute bottom-6 left-5 right-5 overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-2xl"
          style={{
            zIndex: 10,
            opacity,
            transform: [
              {
                translateY,
              },
              {
                scale,
              },
            ],
          }}
        >
          {/* Track information */}
          <View className="border-b border-black/[0.06] px-5 pb-4 pt-5">
            <Text
              numberOfLines={1}
              className="font-google text-[15px] text-[#111111]"
            >
              {track.name}
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 font-google text-[12px] text-[#8E8E93]"
            >
              {track.artist ?? 'Artista desconhecido'}
            </Text>
          </View>

          {/* Remove */}
          <Pressable
            onPress={handleRemove}
            className="h-[58px] flex-row items-center px-5 active:bg-[#F2F2F4]"
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F1F3]">
              <Ionicons
                name="trash-outline"
                size={19}
                color="#FF3B30"
              />
            </View>

            <Text className="ml-3 font-google text-[15px] text-[#FF3B30]">
              Remover da biblioteca
            </Text>
          </Pressable>

          {/* Cancel */}
          <View className="border-t border-black/[0.06]">
            <Pressable
              onPress={handleClose}
              className="h-[58px] items-center justify-center active:bg-[#F2F2F4]"
            >
              <Text className="font-google text-[15px] text-[#111111]">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

function TrackRow({
  track,
  isCurrent,
  isPlaying,
  onPress,
  onMorePress,
}: {
  track: Track
  isCurrent: boolean
  isPlaying: boolean
  onPress: () => void
  onMorePress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-2 active:bg-black/[0.03]"
    >
      <Artwork
        track={track}
        isCurrent={isCurrent}
        isPlaying={isPlaying}
      />

      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className={`font-google text-[15px] ${
            isCurrent
              ? 'text-[#111111]'
              : 'text-[#1C1C1E]'
          }`}
        >
          {track.name}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-1 font-google text-[12px] text-[#8E8E93]"
        >
          {track.artist ?? 'Artista desconhecido'}
          {track.album ? ` · ${track.album}` : ''}
        </Text>
      </View>

      <Pressable
        onPress={onMorePress}
        hitSlop={10}
        className="ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-black/[0.05]"
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color="#8E8E93"
        />
      </Pressable>
    </Pressable>
  )
}

export function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPress,
  onRemoveTrack,
}: TrackListProps) {
  const [selectedTrack, setSelectedTrack] =
    useState<Track | null>(null)

  const [search, setSearch] = useState('')

  const filteredTracks = tracks.filter((track) => {
    const query = search.trim().toLowerCase()

    if (!query) return true

    const name = track.name?.toLowerCase() ?? ''
    const artist = track.artist?.toLowerCase() ?? ''
    const album = track.album?.toLowerCase() ?? ''

    return (
      name.includes(query) ||
      artist.includes(query) ||
      album.includes(query)
    )
  })

  function closeMenu() {
    setSelectedTrack(null)
  }

  function handleRemove() {
    if (!selectedTrack) return

    const trackToRemove = selectedTrack

    // Primeiro desmonta o menu.
    setSelectedTrack(null)

    // Depois remove a música.
    onRemoveTrack?.(trackToRemove)
  }

  function renderHeader() {
    return (
      <View className="px-5 pb-4">

        {/* Search */}
        <View className="h-11 flex-row items-center rounded-[13px] bg-[#F2F2F4] px-3.5">
          <Ionicons
            name="search"
            size={18}
            color="#8E8E93"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pesquisar músicas"
            placeholderTextColor="#8E8E93"
            autoCorrect={false}
            autoCapitalize="none"
            className="ml-2 flex-1 font-google text-[14px] text-[#111111]"
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch('')}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-[#D9D9DD]"
            >
              <Ionicons
                name="close"
                size={14}
                color="#66666B"
              />
            </Pressable>
          )}
        </View>
      </View>
    )
  }

  function renderEmpty() {
    if (tracks.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-10">
          <View className="h-16 w-16 items-center justify-center rounded-[20px] bg-[#F2F2F4]">
            <Ionicons
              name="musical-notes-outline"
              size={28}
              color="#8E8E93"
            />
          </View>

          <Text className="mt-5 text-center font-google-medium text-[17px] text-[#111111]">
            Biblioteca vazia
          </Text>

          <Text className="mt-2 text-center font-google text-[13px] leading-5 text-[#8E8E93]">
            Importe músicas do seu dispositivo para
            começar a criar sua biblioteca.
          </Text>
        </View>
      )
    }

    return (
      <View className="flex-1 items-center justify-center px-10">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F2F2F4]">
          <Ionicons
            name="search-outline"
            size={24}
            color="#8E8E93"
          />
        </View>

        <Text className="mt-4 text-center font-google-medium text-[16px] text-[#111111]">
          Nenhuma música encontrada
        </Text>

        <Text className="mt-1 text-center font-google text-[13px] text-[#8E8E93]">
          Tenta pesquisar por outro nome ou artista.
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <FlatList
        className="flex-1"
        data={filteredTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackRow
            track={item}
            isCurrent={currentTrack?.id === item.id}
            isPlaying={
              isPlaying &&
              currentTrack?.id === item.id
            }
            onPress={() => onTrackPress(item)}
            onMorePress={() => setSelectedTrack(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraData={{
          currentTrackId: currentTrack?.id,
          isPlaying,
          search,
        }}
        contentContainerStyle={{
          paddingBottom: 150,
          flexGrow:
            filteredTracks.length === 0 ? 1 : undefined,
        }}
      />

      {selectedTrack && (
        <TrackMenu
          track={selectedTrack}
          onRemove={handleRemove}
          onClose={closeMenu}
        />
      )}
    </View>
  )
}