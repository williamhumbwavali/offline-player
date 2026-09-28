import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Track } from '@/types/music'

type PlayerState = {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean

  shuffle: boolean
  repeat: boolean

  setTracks: (tracks: Track[]) => void
  addTracks: (tracks: Track[]) => void
  removeTrack: (trackId: string) => void

  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (isPlaying: boolean) => void

  setShuffle: (shuffle: boolean) => void
  setRepeat: (repeat: boolean) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      tracks: [],
      currentTrack: null,
      isPlaying: false,

      shuffle: false,
      repeat: false,

      setTracks: (tracks) =>
        set({
          tracks,
        }),

      addTracks: (tracks) =>
        set((state) => ({
          tracks: [
            ...state.tracks,
            ...tracks.filter(
              (newTrack) =>
                !state.tracks.some(
                  (track) =>
                    track.id === newTrack.id,
                ),
            ),
          ],
        })),

      removeTrack: (trackId) =>
        set((state) => ({
          tracks: state.tracks.filter(
            (track) => track.id !== trackId,
          ),

          currentTrack:
            state.currentTrack?.id === trackId
              ? null
              : state.currentTrack,

          isPlaying:
            state.currentTrack?.id === trackId
              ? false
              : state.isPlaying,
        })),

      setCurrentTrack: (track) =>
        set({
          currentTrack: track,
          isPlaying: false,
        }),

      setIsPlaying: (isPlaying) =>
        set({
          isPlaying,
        }),

      setShuffle: (shuffle) =>
        set({
          shuffle,
        }),

      setRepeat: (repeat) =>
        set({
          repeat,
        }),
    }),
    {
      name: 'offline-player-storage',

      storage: createJSONStorage(
        () => AsyncStorage,
      ),

      partialize: (state) => ({
        tracks: state.tracks,
        currentTrack: state.currentTrack,
        shuffle: state.shuffle,
        repeat: state.repeat,
      }),
    },
  ),
)