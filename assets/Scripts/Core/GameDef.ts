export interface Game2048Location{
    rIndex: number,
    cIndex: number,
}

export enum MoveDirection{
    Up,
    Down,
    Left,
    Right
}

export const MaxRowAndCol = 4;

export interface LocationData{
    location:Game2048Location,
    number:number
}


export enum AudioDef{
    Merge = "Audio/merge",
    Move = "Audio/move",
}

export enum CookieDef{
    HighestScore = "CookieDef_HighestScore"
}