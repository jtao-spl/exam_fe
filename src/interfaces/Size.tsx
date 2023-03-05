import { IComponent } from "./Component"

export interface ISize {
    Id: number,
    ComponentId: number,
    ComponentName: string,
    FirstType: number,
    SecondType?: number,
    BaseSize?: number,
    UpSize?: number,
    BottomSize?: number,
    GeoToleranceType?: string,
    GeoToleranceVal?: string,
    SurfaceRoughnessType?: string,
    SurfaceRoughnessVal?: string,
    SurfaceRoughnessCount?: number,
    UnDeclaredChamferCount?: number,
    UnDeclaredChamferTotalVal?: number
    Deleted: boolean
    Color: string
}
export interface ISizeListResp {
    sizes: ISize[],
    pageSize: number,
    total: number
}
export interface ISizeWithKey extends ISize {
    key: React.Key
}

export interface IShowSizeListProps {
    sizeList?: ISize[],
    deleteCallback: () => void,
    displayUpdateSizeModal: (size: ISize) => void
}

export interface ISizePrecisionData {
    Id: number,
    UpSize: number,
    BottomSize: number
}

export interface IEditPrecisionProps {
    examId: number,
    level: number,
    callback: () => void
}

export interface ISizeExtended extends ISize {
    defaultScore?: number
}

export const gdtSymbleArray: Array<string> = ["u", "c", "e", "g", "k", "d", "f", "b", "a", "r", "i", "j", "h", "t"];
export const sizeSymbolArray: Array<string> = ['L', 'D', 'R', '∠']

export interface IAddSizeProps {
    visible: boolean
    componentId: number,
    callback: (refresh?: boolean) => void
}

export interface IDelteSizeProps {
    size?: ISize
    refresh: (id: number) => void
    isAggSizeDeletable: boolean
}

export interface IEditSizeProps {
    size?: ISize,
    cancel: (refersh?: boolean) => void,
    visible: boolean,
}
export interface ISizeWithScore extends ISize {
    score?: number,
}
export interface ISizeWithScoreAll extends ISize {
    SelfSize?: number,
    SelfScore?: number,
    GroupSize?: number,
    GroupScore?: number,
    FinalSize?: number,
    FinalScore?: number
  }