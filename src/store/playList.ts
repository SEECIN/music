import { defineStore } from "pinia";
import { ref } from "vue";
import type { songType, lyric } from "@/config/interface.d";
import { useAudioStore } from "@/store/audio";
import Http from "@/request/http";
import formatSeconds from "@/util/formatSeconds";

export const usePlayListStore = defineStore("playList", () => {
  const audioStore = useAudioStore();
  let playing = ref<songType[]>([]);
  let playList = ref<songType[]>([]);
  let lyric = ref<lyric[]>([]);

  const changePlaying = async (song: songType) => {
    playing.value[0] = song;
    lyric.value = await getLyric();
    const src = await getPlayUrl(song);
    audioStore.pauseAudio();
    audioStore.currentTime = 0;
    audioStore.setAudioSrc(src);
  };

  const setPlayList = (list: songType[]) => {
    playList.value = list;
  };

  const getPlayUrl = async (song: songType) => {
    const result = await Http({
      requestName: "getPlayUrl",
      parmas: {
        id: song.id,
        level: "standard",
      },
    });
    return result.data[0].url;
  };

  const getLyric = async () => {
    lyric.value = [];
    const res = await Http({
      requestName: "getLyric",
      parmas: { id: playing.value[0].id },
    });
    return res.lrc.lyric
      .split("\n")
      .map((item: string) => {
        if (item[0] === "{") {
          let jsonItem = JSON.parse(item);
          let text = "";
          if (jsonItem.c.length > 1) {
            for (let i = 0; i < jsonItem.c.length; i++) {
              text = text + jsonItem.c[i].tx;
            }
            return { time: formatSeconds(jsonItem.t / 1000).slice(0, 8), text };
          } else {
            return {
              time: formatSeconds(jsonItem.t / 1000).slice(0, 8),
              text: jsonItem.c[0].tx,
            };
          }
        } else {
          return {
            time: item.split("]")[0].slice(1),
            text: item.split("]")[1],
          };
        }
      })
      .filter((item: lyric, idx: number, arr: lyric[]) => {
        item.prevTime = arr[idx + 1]?.time
          ? arr[idx + 1]?.time
          : formatSeconds(audioStore.duration).slice(3, 8) + ":00";
        return item.text !== "";
      });
  };

  return {
    playing,
    playList,
    lyric,
    changePlaying,
    setPlayList,
  };
});
