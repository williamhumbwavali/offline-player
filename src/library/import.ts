import * as DocumentPicker from 'expo-document-picker'
import type { Track } from '@/types/music' 

export async function pickAudioFiles(): Promise<Track[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    multiple: true,
    copyToCacheDirectory: true,
  })

  if (result.canceled) {
    return []
  }

  return result.assets.map((file) => ({
    id: `${file.name}-${file.size ?? 0}-${file.uri}`,
    name: file.name,
    uri: file.uri,
    mimeType: file.mimeType,
    size: file.size,
  }))
}