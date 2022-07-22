
export interface IResolvedAudio {
  type: "audio";
  hasAccessKey: boolean;
  args: {
    owner_id: number;
    id: number;
    access_key?: string;
  };
}

export interface IResolvedPlaylist {
  type: "playlist";
  hasAccessKey: boolean;
  args: {
    owner_id: number;
    id: number;
    access_key?: string;
  };
}

export interface IResolvedAlbum {
  type: "album";
  hasAccessKey: boolean;
  args: {
    owner_id: number;
    id: number;
    access_key?: string;
  };
}

export interface IResolvedQuery {
  type: "query";
  hasAccessKey: boolean;
  args: {
    q: string;
  };
}

export type IResolveLinkType =
  | IResolvedAudio
  | IResolvedPlaylist
  | IResolvedQuery
  | IResolvedAlbum;
 
export type IExecuteResponse<T> = {
  response: T;
  errors: unknown[];
}
export interface IAudioGetOptions {
  count?: number;
  offset?: 0;
}
export interface IAudioGetResult {
  count: number;
  items: IAudioItem[];
}

export interface ISearchOptions extends IAudioGetOptions {}
export interface ISearchResult extends IAudioGetResult {}

export interface IPlaylistGetOptions extends IAudioGetOptions {}
export interface IPlaylistGetResult {
  playlist: IPlaylistItem;
  audios: IAudioGetResult;
}

export interface IAlbumGetOptions extends IAudioGetOptions {}
export interface IAlbumGetResult {
  playlist: IAlbumItem;
  audios: IAudioGetResult;
}

export interface IArtist {
  name: string;
  domain: string;
  id: string;
}

type IThumbPhoto<T extends string> = {
  [k in `photo_${T}`]?: string;
} 
export type IThumb = {
  width: number;
  height: number;
} & IThumbPhoto<"34" | "68" | "135" | "270" | "300" | "600" | "1200">

export interface IAudioItem {
  artist: string;
  id: number;
  owner_id: number;
  title: string;
  duraction: number;
  access_key: string;
  ads: {
    content_id: string;
    duration: string;
    account_age_type: string;
    puid: string;
  };
  is_explicit: boolean;
  is_focus_track: boolean;
  is_licensed: boolean;
  track_code: string;
  url: string;
  date: number;
  album?: {
    id: number;
    title: string;
    owner_id: number;
    access_key: string;
    thumb: IThumb;
  };
  main_artists?: IArtist[];
  featured_artists?: IArtist[];
  subtitle?: string;
  genre_id: number;
  short_videos_allowed: boolean;
  stories_allowed: boolean;
  stories_cover_allowed: boolean;
}

export interface IPlaylistItem {
  id: number;
  owner_id: number;
  type: number;
  title: string;
  description: string;
  count: number;
  followers: number;
  plays: number;
  create_time: number;
  update_time: number;
  genres: ({ id: number; name: string; })[];
  is_following: boolean;
  year?: number;
  followed?: {
    playlist_id: number;
    owner_id: number;
  };
  is_explicit?: boolean;
  main_artists?: IArtist[];
  photo?: IThumb;
  thumbs?: IThumb[];
  permissions: {
    play: boolean;
    share: boolean;
    edit: boolean;
    follow: boolean;
  };
  subtitle_badge: boolean;
  play_button: boolean;
  access_key: string;
  album_type: string;
}

export interface IAlbumItem extends IPlaylistItem {}