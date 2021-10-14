export interface Error {
    data: {
        message: string
    }
}

export interface SongInfo {
    link: string;
    message: string;
}

export interface SongData {
    addedByUserName: string,
    text: string,
    ts: string,
}

export interface PermalinkResponse {
    ok: boolean,
    channel: string,
    permalink: string
}

// TODO make this better...wish this came from the api itself....
export interface MessageCallback {
    message: any,
    ack: any,
    say: (text: string | object) => void,
    body: any,
    client: any
  }
  