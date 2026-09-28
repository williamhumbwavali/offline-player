import { useEffect, useState } from 'react'

import { usePlayerStore } from '@/store/player'

import {
  getPlayer,
  loadTrack,
} from './player'

export function usePlayer() {
  const tracks = usePlayerStore(
    (state) => state.tracks,
  )

  const currentTrack = usePlayerStore(
    (state) => state.currentTrack,
  )

  const shuffle = usePlayerStore(
    (state) => state.shuffle,
  )

  const repeat = usePlayerStore(
    (state) => state.repeat,
  )

  const setCurrentTrack = usePlayerStore(
    (state) => state.setCurrentTrack,
  )

  const setIsPlaying = usePlayerStore(
    (state) => state.setIsPlaying,
  )

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const player = getPlayer()

  useEffect(() => {
    if (!currentTrack) {
      return
    }

    const audioPlayer = loadTrack(
      currentTrack.uri,
    )

    const subscription =
      audioPlayer.addListener(
        'playbackStatusUpdate',
        (status) => {
          setCurrentTime(status.currentTime)
          setDuration(status.duration)

          if (status.didJustFinish) {
            handleTrackFinished()
          }
        },
      )

    return () => {
      subscription.remove()
    }
  }, [
    currentTrack,
    repeat,
    shuffle,
    tracks,
  ])

  function play() {
    player.play()
    setIsPlaying(true)
  }

  function pause() {
    player.pause()
    setIsPlaying(false)
  }

  function seekTo(seconds: number) {
    player.seekTo(seconds)
  }

  function playTrack(track: typeof currentTrack) {
    if (!track) {
      return
    }

    const audioPlayer = loadTrack(
      track.uri,
    )

    setCurrentTrack(track)

    audioPlayer.play()
    setIsPlaying(true)
  }

  function getNextTrack() {
    if (!currentTrack || tracks.length === 0) {
      return null
    }

    if (shuffle && tracks.length > 1) {
      const availableTracks = tracks.filter(
        (track) =>
          track.id !== currentTrack.id,
      )

      return availableTracks[
        Math.floor(
          Math.random() *
            availableTracks.length,
        )
      ]
    }

    const currentIndex =
      tracks.findIndex(
        (track) =>
          track.id === currentTrack.id,
      )

    if (
      currentIndex === -1 ||
      currentIndex >= tracks.length - 1
    ) {
      return null
    }

    return tracks[currentIndex + 1]
  }

  function getPreviousTrack() {
    if (!currentTrack || tracks.length === 0) {
      return null
    }

    const currentIndex =
      tracks.findIndex(
        (track) =>
          track.id === currentTrack.id,
      )

    if (currentIndex <= 0) {
      return null
    }

    return tracks[currentIndex - 1]
  }

  function next() {
    const nextTrack = getNextTrack()

    if (!nextTrack) {
      return
    }

    playTrack(nextTrack)
  }

  function previous() {
    const previousTrack =
      getPreviousTrack()

    if (!previousTrack) {
      return
    }

    playTrack(previousTrack)
  }

  function handleTrackFinished() {
    if (!currentTrack) {
      return
    }

    if (repeat) {
      player.seekTo(0)
      player.play()
      setIsPlaying(true)
      return
    }

    const nextTrack = getNextTrack()

    if (!nextTrack) {
      setIsPlaying(false)
      player.seekTo(0)
      return
    }

    playTrack(nextTrack)
  }

  return {
    player,
    currentTrack,
    currentTime,
    duration,

    shuffle,
    repeat,

    play,
    pause,
    playTrack,
    next,
    previous,
    seekTo,
  }
}