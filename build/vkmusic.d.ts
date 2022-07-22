import { API, IAPIOptions } from "vk-io";
import { IAlbumGetOptions, IAlbumGetResult, IAudioGetOptions, IAudioGetResult, IPlaylistGetOptions, IPlaylistGetResult, IResolveLinkType, ISearchOptions, ISearchResult } from "./types";
export interface IVKMusicOptions {
    api: Partial<IAPIOptions> & {
        token: string;
    };
}
export declare function resolveURLType(url: string): IResolveLinkType;
export declare const makeAudioId: (owner_id: number, id: number, access_key: string | undefined) => string;
export declare class VKMusic {
    api: API;
    constructor(options: IVKMusicOptions);
    search(q: string, opts?: ISearchOptions): Promise<ISearchResult>;
    getPlaylist(owner_id: number, id: number, access_key: string, opts?: IPlaylistGetOptions): Promise<IPlaylistGetResult>;
    getAlbum(owner_id: number, id: number, access_key: string, opts?: IAlbumGetOptions): Promise<IAlbumGetResult>;
    getURLById(audios: string[], opts?: IAudioGetOptions): Promise<IAudioGetResult>;
}
