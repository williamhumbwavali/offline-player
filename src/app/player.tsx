import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Easing,
    Pressable,
    Text,
    View,
    useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { usePlayer } from '@/audio/usePlayer'
import { usePlayerStore } from '@/store/player'

function handleClose() {
    if (router.canGoBack()) {
        router.back()
    } else {
        router.replace('/')
    }
}

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
        return '0:00'
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export default function PlayerScreen() {
    const insets = useSafeAreaInsets()
    const { width: windowWidth } = useWindowDimensions()

    const {
        currentTrack,
        play,
        pause,
        currentTime,
        duration,
        seekTo,
        next,
        previous,
    } = usePlayer()

    const isPlaying = usePlayerStore(
        (state) => state.isPlaying,
    )

    const tracks = usePlayerStore(
        (state) => state.tracks,
    )

    const shuffle = usePlayerStore(
        (state) => state.shuffle,
    )

    const repeat = usePlayerStore(
        (state) => state.repeat,
    )

    const setShuffle = usePlayerStore(
        (state) => state.setShuffle,
    )

    const setRepeat = usePlayerStore(
        (state) => state.setRepeat,
    )

    const removeTrack = usePlayerStore(
        (state) => state.removeTrack,
    )

    const [showMenu, setShowMenu] = useState(false)

    const progressWidth = useRef(0)

    const artScale = useRef(
        new Animated.Value(isPlaying ? 1 : 0.94),
    ).current

    const enter = useRef(
        new Animated.Value(0),
    ).current

    // Menu animations
    const menuOpacity = useRef(
        new Animated.Value(0),
    ).current

    const menuScale = useRef(
        new Animated.Value(0.94),
    ).current

    const menuTranslateY = useRef(
        new Animated.Value(14),
    ).current

    useEffect(() => {
        Animated.spring(artScale, {
            toValue: isPlaying ? 1 : 0.94,
            useNativeDriver: true,
            speed: 8,
            bounciness: 4,
        }).start()
    }, [isPlaying, artScale])

    useEffect(() => {
        Animated.timing(enter, {
            toValue: 1,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start()
    }, [enter])

    const bottomInset =
        Math.max(insets.bottom, 16) + 16

    if (!currentTrack) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-10">
                <Text className="text-center font-bold text-[22px] leading-[28px] tracking-[-0.5px] text-black">
                    Nenhuma música selecionada
                </Text>

                <Text className="mt-2 max-w-[270px] text-center font-google text-[15px] leading-[22px] text-[#6E6E73]">
                    Escolha uma faixa na sua biblioteca para
                    começar a ouvir.
                </Text>

                <Pressable
                    onPress={handleClose}
                    className="mt-8 h-14 items-center justify-center rounded-2xl bg-[#F2F2F4] px-10 active:scale-[0.97] active:opacity-90"
                >
                    <Text className="font-medium text-[15px]">
                        Voltar à biblioteca
                    </Text>
                </Pressable>
            </View>
        )
    }

    const index = tracks.findIndex(
        (track) => track.id === currentTrack.id,
    )

    const hasPrevious = index > 0

    const hasNext = shuffle
        ? tracks.length > 1
        : index >= 0 &&
          index < tracks.length - 1

    const progress =
        duration > 0
            ? Math.min(
                  Math.max(
                      currentTime / duration,
                      0,
                  ),
                  1,
              )
            : 0

    const artSize = Math.min(
        windowWidth - 56,
        360,
    )

    function handleSeek(value: number) {
        if (duration <= 0) {
            return
        }

        seekTo(value * duration)
    }

    function handleTogglePlay() {
        if (isPlaying) {
            pause()
        } else {
            play()
        }
    }

    function handlePrevious() {
        if (!hasPrevious) {
            return
        }

        previous()
    }

    function handleNext() {
        if (!hasNext) {
            return
        }

        next()
    }

    function openMenu() {
        setShowMenu(true)

        menuOpacity.setValue(0)
        menuScale.setValue(0.94)
        menuTranslateY.setValue(14)

        requestAnimationFrame(() => {
            Animated.parallel([
                Animated.timing(menuOpacity, {
                    toValue: 1,
                    duration: 180,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),

                Animated.spring(menuScale, {
                    toValue: 1,
                    speed: 22,
                    bounciness: 3,
                    useNativeDriver: true,
                }),

                Animated.spring(menuTranslateY, {
                    toValue: 0,
                    speed: 22,
                    bounciness: 3,
                    useNativeDriver: true,
                }),
            ]).start()
        })
    }

    function closeMenu(callback?: () => void) {
        Animated.parallel([
            Animated.timing(menuOpacity, {
                toValue: 0,
                duration: 140,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),

            Animated.timing(menuScale, {
                toValue: 0.96,
                duration: 140,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),

            Animated.timing(menuTranslateY, {
                toValue: 12,
                duration: 140,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowMenu(false)
            callback?.()
        })
    }

    function handleRemoveTrack() {
        if (!currentTrack) {
            return
        }

        const trackId = currentTrack.id

        closeMenu(() => {
            pause()
            removeTrack(trackId)

            if (router.canGoBack()) {
                router.back()
            } else {
                router.replace('/')
            }
        })
    }

    return (
        <View
            className="flex-1 bg-white px-7 pt-3"
            style={{
                paddingBottom: bottomInset,
            }}
        >
            {/* Grabber */}
            <View className="items-center">
                <View className="h-1 w-10 rounded-full bg-[#D1D1D6]" />
            </View>

            {/* Header */}
            <View className="-mx-2 mt-3 h-12 flex-row items-center justify-between">
                <Pressable
                    onPress={handleClose}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                    className="h-11 w-11 items-center justify-center rounded-full active:bg-[#F2F2F4]"
                >
                    <Ionicons
                        name="chevron-down"
                        size={26}
                        color="#000000"
                    />
                </Pressable>

                <View className="items-center">
                    <Text className="font-google text-[12px] text-[#8E8E93]">
                        Tocando agora da
                    </Text>

                    <Text className="mt-0.5 font-bold text-2xl text-black">
                        Sua biblioteca
                    </Text>
                </View>

                <Pressable
                    onPress={openMenu}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Mais opções"
                    className="h-11 w-11 items-center justify-center rounded-full active:bg-[#F2F2F4]"
                >
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={20}
                        color="#000000"
                    />
                </Pressable>
            </View>

            {/* Main player */}
            <Animated.View
                className="flex-1"
                style={{
                    opacity: enter,
                    transform: [
                        {
                            translateY:
                                enter.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [12, 0],
                                }),
                        },
                    ],
                }}
            >
                {/* Artwork */}
                <View className="flex-1 items-center justify-center">
                    <Animated.View
                        className="items-center justify-center overflow-hidden rounded-[40px]"
                        style={{
                            width: artSize,
                            height: artSize,
                            backgroundColor: '#F1F1F3',
                            transform: [
                                {
                                    scale: artScale,
                                },
                            ],
                        }}
                    >
                        <Ionicons
                            name="musical-notes"
                            size={Math.round(
                                artSize * 0.24,
                            )}
                            color="rgba(0,0,0,0.22)"
                        />
                    </Animated.View>
                </View>

                {/* Track information */}
                <View className="mt-6 flex-row items-center">
                    <View className="flex-1 pr-4">
                        <Text
                            numberOfLines={1}
                            className="font-google text-xl text-black"
                        >
                            {currentTrack.name}
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="mt-0.5 font-google text-[16px] leading-[22px] text-[#6E6E73]"
                        >
                            {currentTrack.artist ??
                                'Artista desconhecido'}
                        </Text>
                    </View>
                </View>

                {/* Progress */}
                <View className="mt-6">
                    <Pressable
                        onLayout={(event) => {
                            progressWidth.current =
                                event.nativeEvent.layout.width
                        }}
                        onPress={(event) => {
                            if (
                                progressWidth.current <=
                                0
                            ) {
                                return
                            }

                            const progressValue =
                                Math.max(
                                    0,
                                    Math.min(
                                        event.nativeEvent
                                            .locationX /
                                            progressWidth.current,
                                        1,
                                    ),
                                )

                            handleSeek(progressValue)
                        }}
                        className="h-6 justify-center"
                    >
                        <View
                            pointerEvents="none"
                            className="h-1 overflow-hidden rounded-full bg-[#E5E5EA]"
                        >
                            <View
                                className="h-full rounded-full bg-black"
                                style={{
                                    width: `${progress * 100}%`,
                                }}
                            />
                        </View>
                    </Pressable>

                    <View className="mt-0.5 flex-row justify-between">
                        <Text className="font-google text-[12px] text-[#8E8E93]">
                            {formatTime(currentTime)}
                        </Text>

                        <Text className="font-google text-[12px] text-[#8E8E93]">
                            {formatTime(duration)}
                        </Text>
                    </View>
                </View>

                {/* Controls */}
                <View className="mt-4 flex-row items-center justify-between">
                    {/* Shuffle */}
                    <Pressable
                        onPress={() =>
                            setShuffle(!shuffle)
                        }
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={
                            shuffle
                                ? 'Desativar aleatório'
                                : 'Ativar aleatório'
                        }
                        className="h-11 w-11 items-center justify-center active:opacity-60"
                    >
                        <Ionicons
                            name="shuffle"
                            size={22}
                            color={
                                shuffle
                                    ? '#000000'
                                    : '#A1A1A6'
                            }
                        />

                        {shuffle && (
                            <View className="absolute bottom-0.5 h-1 w-1 rounded-full bg-black" />
                        )}
                    </Pressable>

                    {/* Previous */}
                    <Pressable
                        disabled={!hasPrevious}
                        onPress={handlePrevious}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Anterior"
                        className={`h-14 w-14 items-center justify-center active:opacity-60 ${
                            hasPrevious
                                ? ''
                                : 'opacity-25'
                        }`}
                    >
                        <Ionicons
                            name="play-skip-back"
                            size={28}
                            color="#000000"
                        />
                    </Pressable>

                    {/* Play / Pause */}
                    <Pressable
                        onPress={handleTogglePlay}
                        accessibilityRole="button"
                        accessibilityLabel={
                            isPlaying
                                ? 'Pausar'
                                : 'Reproduzir'
                        }
                        className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F1F1F3] active:scale-95 active:opacity-90"
                    >
                        <Ionicons
                            name={
                                isPlaying
                                    ? 'pause'
                                    : 'play'
                            }
                            size={30}
                            color="#000000"
                            style={{
                                marginLeft:
                                    isPlaying ? 0 : 3,
                            }}
                        />
                    </Pressable>

                    {/* Next */}
                    <Pressable
                        disabled={!hasNext}
                        onPress={handleNext}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Próxima"
                        className={`h-14 w-14 items-center justify-center active:opacity-60 ${
                            hasNext
                                ? ''
                                : 'opacity-25'
                        }`}
                    >
                        <Ionicons
                            name="play-skip-forward"
                            size={28}
                            color="#000000"
                        />
                    </Pressable>

                    {/* Repeat */}
                    <Pressable
                        onPress={() =>
                            setRepeat(!repeat)
                        }
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={
                            repeat
                                ? 'Desativar repetição'
                                : 'Ativar repetição'
                        }
                        className="h-11 w-11 items-center justify-center active:opacity-60"
                    >
                        <Ionicons
                            name="repeat"
                            size={22}
                            color={
                                repeat
                                    ? '#000000'
                                    : '#A1A1A6'
                            }
                        />

                        {repeat && (
                            <View className="absolute bottom-0.5 h-1 w-1 rounded-full bg-black" />
                        )}
                    </Pressable>
                </View>
            </Animated.View>

            {/* More options menu */}
            {showMenu && (
                <View
                    className="absolute inset-0 z-50"
                    pointerEvents="box-none"
                >
                    {/* Backdrop */}
                    <Pressable
                        onPress={() => closeMenu()}
                        className="absolute inset-0"
                    >
                        <Animated.View
                            pointerEvents="none"
                            className="absolute inset-0 bg-black/10"
                            style={{
                                opacity: menuOpacity,
                            }}
                        />
                    </Pressable>

                    {/* Menu */}
                    <Animated.View
                        className="absolute bottom-6 left-5 right-5 overflow-hidden rounded-[26px] border border-white/80 bg-white/95 shadow-2xl"
                        style={{
                            opacity: menuOpacity,
                            transform: [
                                {
                                    translateY:
                                        menuTranslateY,
                                },
                                {
                                    scale: menuScale,
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
                                {currentTrack.name}
                            </Text>

                            <Text
                                numberOfLines={1}
                                className="mt-1 font-google text-[13px] text-[#8E8E93]"
                            >
                                {currentTrack.artist ??
                                    'Artista desconhecido'}
                            </Text>
                        </View>

                        {/* Remove */}
                        <Pressable
                            onPress={handleRemoveTrack}
                            className="h-[62px] flex-row items-center px-5 active:bg-[#F4F4F6]"
                        >
                            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F3E7E7]">
                                <Ionicons
                                    name="trash-outline"
                                    size={19}
                                    color="#C0392B"
                                />
                            </View>

                            <Text className="ml-3 font-google text-[15px] text-[#C0392B]">
                                Remover da biblioteca
                            </Text>
                        </Pressable>

                        {/* Cancel */}
                        <View className="border-t border-black/[0.06]">
                            <Pressable
                                onPress={() =>
                                    closeMenu()
                                }
                                className="h-[58px] items-center justify-center active:bg-[#F4F4F6]"
                            >
                                <Text className="font-google text-[15px] text-[#111111]">
                                    Cancelar
                                </Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </View>
            )}
        </View>
    )
}