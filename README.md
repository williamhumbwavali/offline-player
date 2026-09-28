# OPlayer

> Um player de música offline, simples, privado e feito para ouvir a tua própria biblioteca.

OPlayer é um player de música para dispositivos móveis focado em uma experiência **local e offline**.

**Sem streaming. Sem contas. Sem anúncios. Apenas a tua música.**

## Screenshots

<p align="center">
  <img src="./screen-1.jpeg" width="280" alt="OPlayer - Biblioteca de músicas" />
  <img src="./screen-2.jpeg" width="280" alt="OPlayer - Player de música" />
</p>

## Sobre

O OPlayer foi criado com uma ideia simples: oferecer uma experiência moderna para reproduzir músicas armazenadas localmente no dispositivo.

A interface combina uma estética minimalista com controles rápidos para tornar a navegação pela biblioteca e a reprodução das faixas simples e agradável.

## Features

* 🎵 Importação de músicas do dispositivo
* 📚 Biblioteca de músicas locais
* 🔎 Pesquisa por música, artista e álbum
* ▶️ Play / Pause
* ⏮️ Faixa anterior
* ⏭️ Próxima faixa
* 🔀 Reprodução aleatória
* 🔁 Repetição
* ⏱️ Barra de progresso e seek
* 🗑️ Remoção de músicas da biblioteca
* 💾 Persistência da biblioteca
* 📱 Interface otimizada para mobile
* 🌑 Design minimalista inspirado em players modernos

## Stack

* **React Native**
* **Expo**
* **Expo Router**
* **TypeScript**
* **NativeWind**
* **Zustand**
* **Ionicons**

## Filosofia

O OPlayer não tenta ser mais um serviço de streaming.

Ele é pensado para quem já possui as próprias músicas e quer uma experiência de reprodução moderna sem depender de uma conexão com a internet.

**Local-first. Private by design.**

## Estrutura

```text
OPlayer/
├── app/
│   ├── index.tsx
│   └── player.tsx
│
├── audio/
│   └── usePlayer.ts
│
├── components/
│   ├── MiniPlayer.tsx
│   ├── TrackList.tsx
│   └── ...
│
├── store/
│   └── player.ts
│
├── types/
│   └── music.ts
│
└── ...
```

## Desenvolvimento

Instala as dependências:

```bash
npm install
```

Inicia o projeto:

```bash
npx expo start
```

Depois abre o projeto no dispositivo ou simulador através do Expo.

## Estado do projeto

OPlayer está atualmente em desenvolvimento e já possui o núcleo da experiência de reprodução e gerenciamento da biblioteca funcionando.

Novas funcionalidades podem ser adicionadas conforme o projeto evolui.

### OPlayer

**Your music. Your device. Your player.**
