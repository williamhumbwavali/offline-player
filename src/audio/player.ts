import {
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio'

let player: ReturnType<typeof createAudioPlayer> | null = null

let loadedUri: string | null = null

export async function configureAudio() {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
  })
}

export function getPlayer() {
  if (!player) {
    player = createAudioPlayer()
  }

  return player
}

export function loadTrack(uri: string) {
  // Cria o player apenas uma vez.
  if (!player) {
    player = createAudioPlayer(uri)
    loadedUri = uri

    return player
  }

  // A mesma música já está carregada.
  // NÃO fazemos replace().
  if (loadedUri === uri) {
    return player
  }

  // É uma música diferente.
  player.replace(uri)
  loadedUri = uri

  return player
}

export function getLoadedUri() {
  return loadedUri
}

export function destroyPlayer() {
  player?.remove()

  player = null
  loadedUri = null
}