import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
  Pressable,
  Text,
  View,
} from 'react-native'

import type { Track } from '@/types/music'

type MiniPlayerProps = {
  track: Track
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export function MiniPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: MiniPlayerProps) {
  const progress =
    duration > 0
      ? Math.min(
          Math.max(currentTime / duration, 0),
          1,
        )
      : 0

  function openPlayer() {
    router.push('/player')
  }

  return (
    <View className="absolute bottom-0 left-0 right-0">
      <View className="overflow-hidden rounded-t-[28px] border border-b-0 border-[#D8D8DC]/80 bg-white/95">
        {/* Progress */}
        <View className="h-[2px] w-full bg-[#E9E9EC]">
          <View
            className="h-full bg-[#77777C]"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </View>

        {/* Track */}
        <View className="h-[92px] flex-row items-center px-6">
          <Pressable
            onPress={openPlayer}
            className="flex-1 justify-center pr-4 active:opacity-60"
          >
            <Text
              numberOfLines={1}
              className="font-google text-[16px] leading-[21px] text-[#111111]"
            >
              {track.name}
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 font-google text-[13px] leading-[18px] text-[#77777C]"
            >
              {track.artist ??
                'Artista desconhecido'}
            </Text>
          </Pressable>

          {/* Controls */}
          <View className="flex-row items-center">
            {/* Previous */}
            <Pressable
              onPress={onPrevious}
              disabled={!hasPrevious}
              hitSlop={8}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                hasPrevious
                  ? 'active:bg-[#F1F1F3]'
                  : 'opacity-30'
              }`}
            >
              <Ionicons
                name="play-skip-back"
                size={20}
                color="#111111"
              />
            </Pressable>

            {/* Play / Pause */}
            <Pressable
              onPress={onTogglePlay}
              hitSlop={8}
              className="mx-1 h-12 w-12 items-center justify-center rounded-full bg-[#F1F1F3] active:bg-[#E6E6E9]"
            >
              <Ionicons
                name={
                  isPlaying
                    ? 'pause'
                    : 'play'
                }
                size={23}
                color="#111111"
                style={{
                  marginLeft: isPlaying ? 0 : 2,
                }}
              />
            </Pressable>

            {/* Next */}
            <Pressable
              onPress={onNext}
              disabled={!hasNext}
              hitSlop={8}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                hasNext
                  ? 'active:bg-[#F1F1F3]'
                  : 'opacity-30'
              }`}
            >
              <Ionicons
                name="play-skip-forward"
                size={20}
                color="#111111"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}