export interface bannerResType {
  imageUrl: string;
}

export interface currentBannerType {
  current: number;
}

export interface bannerListType {
  [key: number]: string;
}

export interface ballListType {
  id: string;
  name: string;
  iconUrl: string;
}

export interface playListType {
  id: string;
  name?: string;
  picUrl?: string;
  playCount: number;
  coverImgUrl?: string;
  updateTime: string;
  description: string;
}

export interface topListType {
  id: string;
  name: string;
  coverImgUrl: string;
  updateTime: number;
  updateFrequency: string;
  playCount: number;
  songs: {
    song: {
      id: string;
      name: string;
      al: {
        picUrl: string;
      };
      ar: {
        artist: {
          id: string;
          name: string;
        };
      };
    };
  };
}

export interface newSongListType {
  id: string;
  name: string;
  alias: array;
  artists: [
    {
      id: string;
      name: string;
    }
  ];
  album: {
    name: string;
    picUrl: string;
  };
}

export interface hotSearchListType {
  searchWord: string;
  content: string;
  iconUrl: string;
}

export interface searchResultType {
  [
    id: string,
    name: string,
    al: {
      name: string;
      picUrl: string;
    },
    ar?: [
      {
        id: string;
        name: string;
      }
    ],
    alia?: [stirng],
    originSongSimpleData?: {
      artists: [
        {
          id: string;
          name: string;
        }
      ];
    },
    coverImgUrl?: string,
    creator?: {
      nickname: string;
    },
    trackCount?: number,
    playCount?: number,
    img1v1Url?: string,
  ];
}

export type songType = {
  id: string;
  name: string;
  al: {
    name: string;
    picUrl: string;
    tns: [string];
  };
  album: {
    name: string;
    picUrl: string;
    blurPicUrl: string;
  };
  ar: [
    {
      id: string;
      name: string;
    }
  ];
  artists: [
    {
      id: string;
      name: string;
    }
  ];
  alia: [stirng];
  alias: [stirng];
};

export interface lyric {
  time: string;
  text: string;
  prevTime: string;
  scrollTop: number;
}
