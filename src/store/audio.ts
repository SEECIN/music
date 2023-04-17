import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { usePlayListStore } from "@/store/playList";

export const useAudioStore = defineStore("audio", () => {
  const playListStore = usePlayListStore();
  const audio = uni.createInnerAudioContext();
  const playModeMap = [
    {
      mode: "sequence",
      iconName: "icon-xunhuan",
      message: "列表循环",
    },
    {
      mode: "random",
      iconName: "icon-suiji",
      message: "随机播放",
    },
    {
      mode: "singleCycle",
      iconName: "icon-24gl-repeatOnce2",
      message: "单曲循环",
    },
  ];
  let isOnPlay = ref(false);
  let duration = ref(0);
  let percentage = ref(0);
  let currentTime = ref(0);
  let playModeIdx = ref(0);
  let playMode = ref(playModeMap[playModeIdx.value]);
  let song;

  const songInPlayList = computed(() => {
    return playListStore.playList.findIndex(
      (item) => item.id === playListStore.playing[0].id
    );
  });

  audio.autoplay = true;

  const setAudioSrc = (src: string): void => {
    isOnPlay.value = false;
    duration.value = 0;
    audio.src = src;
  };

  const playAudio = (): void => {
    audio.play();
    isOnPlay.value = true;
  };

  const pauseAudio = (): void => {
    audio.pause();
    isOnPlay.value = false;
  };

  const changePlayMode = (): void => {
    playModeIdx.value === 2 ? (playModeIdx.value = 0) : playModeIdx.value++;
    playMode.value = playModeMap[playModeIdx.value];
    playMode.value.mode === "singleCycle"
      ? (audio.loop = true)
      : (audio.loop = false);
  };

  const setSeek = (time: number): void => {
    audio.seek(time);
  };

  const prev = () => {
    if (playMode.value.mode === "random") {
      song =
        songInPlayList.value === 0
          ? playListStore.playList[
              uni.$u.random(
                songInPlayList.value + 1,
                playListStore.playList.length - 1
              )
            ]
          : playListStore.playList[uni.$u.random(0, songInPlayList.value - 1)];
    } else {
      song =
        songInPlayList.value === 0
          ? playListStore.playList[playListStore.playList.length - 1]
          : playListStore.playList[songInPlayList.value - 1];
    }
    playListStore.changePlaying(song);
  };

  const next = () => {
    if (playMode.value.mode === "random") {
      song =
        songInPlayList.value === playListStore.playList.length - 1
          ? playListStore.playList[uni.$u.random(0, songInPlayList.value - 1)]
          : playListStore.playList[
              uni.$u.random(
                songInPlayList.value + 1,
                playListStore.playList.length - 1
              )
            ];
    } else {
      song = song =
        songInPlayList.value === playListStore.playList.length - 1
          ? playListStore.playList[0]
          : playListStore.playList[songInPlayList.value + 1];
    }
    playListStore.changePlaying(song);
  };

  audio.onPlay(() => {
    if (!isOnPlay.value) isOnPlay.value = true;
  });

  audio.onTimeUpdate((): void => {
    percentage.value = (audio.currentTime / audio.duration) * 100;
    currentTime.value = audio.currentTime;
    if (duration.value === 0) duration.value = audio.duration;
  });

  audio.onSeeking((): void => {
    audio.paused || audio.pause();
  });

  audio.onSeeked((): void => {
    audio.paused && audio.play();
  });

  audio.onEnded(() => {
    isOnPlay.value = false;
    percentage.value = 100;
    currentTime.value = duration.value;
    if (playMode.value.mode !== "singleCycle") next();
  });

  return {
    audio,
    isOnPlay,
    duration,
    percentage,
    currentTime,
    playMode,
    setAudioSrc,
    playAudio,
    pauseAudio,
    changePlayMode,
    setSeek,
    next,
    prev,
  };
});
