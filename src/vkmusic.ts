import { API, IAPIOptions } from "vk-io";
import {
  IAlbumGetOptions,
  IAlbumGetResult,
  IAudioGetOptions,
  IAudioGetResult,
  IExecuteResponse,
  IPlaylistGetOptions,
  IPlaylistGetResult,
  IResolveLinkType,
  ISearchOptions,
  ISearchResult,
} from "./types";

export interface IVKMusicOptions {
  api: Partial<IAPIOptions> & {
    token: string;
  };
}

export function resolveURLType(url: string): IResolveLinkType {
  const regExpsUrls = {
    album: [
      /^https:\/\/vk.com\/music\/album\/(?<owner_id>-\d+|\d+)_(?<id>\d+)_(?<access_key>.+)$/,
    ],
    playlist: [
      /^https:\/\/vk.com\/(?:audio|music)\?z=audio_playlist(?<owner_id>-\d+|\d+)_(?<id>\d+)\/(?<access_key>.+)$/,
      /^https:\/\/vk.com\/music\/playlist\/(?<owner_id>-\d+|\d+)_(?<id>\d+)_(?<access_key>.+)$/,
    ],
    audio: [
      /^https:\/\/vk.com\/audio(?<owner_id>-\d+|\d+)_(?<id>\d+)(?:_(?<access_key>.+))?$/,
    ],
  };

  for (const [key, regexps] of Object.entries(regExpsUrls)) {
    const regexp = regexps.find((r) => r.test(url));
    if (regexp) {
      const matchResult = regexp.exec(url);
      return {
        // @ts-ignore
        type: key,
        hasAccessKey: matchResult?.groups?.access_key !== undefined,
        // @ts-ignore
        args: matchResult?.groups ? { ...matchResult?.groups } : {},
      };
    }
  }

  return { type: "query", hasAccessKey: false, args: { q: url } };
}
export const makeAudioId = (
  owner_id: number,
  id: number,
  access_key: string | undefined
) => `${owner_id}_${id}${access_key ? `_${access_key}` : ""}`;

export class VKMusic {
  api: API;
  constructor(options: IVKMusicOptions) {
    this.api = new API(options.api);
  }

  search(q: string, opts: ISearchOptions = {}): Promise<ISearchResult> {
    return this.api.call<ISearchResult>("audio.search", {
      q,
      ...opts,
    });
  }
  getPlaylist(
    owner_id: number,
    id: number,
    access_key: string,
    opts: IPlaylistGetOptions = {}
  ) {
    return this.api
      .call<IExecuteResponse<IPlaylistGetResult>>("execute", {
        code: `
        var call = {
          owner_id: Args.owner_id,
          playlist_id: Args.playlist_id,
          access_key: Args.access_key,
          count: Args.count ? Args.count : 0,
          offset: Args.offset ? Args.offset : 0
        };
        return {
          playlist: API.audio.getPlaylistById(call),
          audios: API.audio.get(call)
        };
      `,
        owner_id,
        playlist_id: id,
        access_key,
        ...opts,
      })
      .then((response) => {
        if (response.errors.length > 0) throw response.errors.shift();
        return response.response;
      });
  }
  getAlbum(
    owner_id: number,
    id: number,
    access_key: string,
    opts: IAlbumGetOptions = {}
  ) {
    return this.api
      .call<IExecuteResponse<IAlbumGetResult>>("execute", {
        code: `
        var call = {
          owner_id: Args.owner_id,
          playlist_id: Args.playlist_id,
          access_key: Args.access_key,
          count: Args.count ? Args.count : 0,
          offset: Args.offset ? Args.offset : 0
        };
        return {
          playlist: API.audio.getPlaylistById(call),
          audios: API.audio.get(call)
        };
      `,
        owner_id,
        playlist_id: id,
        access_key,
        ...opts,
      })
      .then((response) => {
        if (response.errors.length > 0) throw response.errors.shift();
        return response.response;
      });
  }
  getURLById(audios: string[], opts: IAudioGetOptions = {}) {
    return this.api.call<IAudioGetResult>("audio.getById", {
      audios,
      ...opts,
    });
  }
}
