export interface IEntity {
    name: string,
    symbol: string
}
export interface IEntityRequired {
    type: string,
    count: number,
    size?: string, //表面粗糙度的尺寸
    required: boolean
}
export const SizedEntity: IEntity[] = [
    {
        name: "长度尺寸",
        symbol: "L",
    },
    {
        name: "直径尺寸",
        symbol: "D",
    },
    {
        name: "半径尺寸",
        symbol: "R",
    },
    {
        name: "角度尺寸",
        symbol: "∠",
    },
]
export const SizedElementSymbol = SizedEntity.map((item: IEntity) => item.symbol);

export const GeoToleranceEntity: IEntity[] = [
    {
        name: "直线度公差",
        symbol: "u",
    },
    {

        name: "平面度公差",
        symbol: "c",
    },
    {

        name: "圆度公差",
        symbol: "e",
    },
    {
        name: "圆柱度公差",
        symbol: "g",
    },
    {
        name: "线轮廓度公差",
        symbol: "k",
    },
    {
        name: "面轮廓度公差",
        symbol: "d",
    },
    {
        name: "平行度公差",
        symbol: "f",
    },
    {
        name: "垂直度公差",
        symbol: "b",
    },
    {
        name: "倾斜度公差",
        symbol: "a",
    },
    {
        name: "同轴度公差",
        symbol: "r",
    },
    {
        name: "对称度公差",
        symbol: "i",
    },
    {
        name: "位置度公差",
        symbol: "j",
    },
    {
        name: "圆跳动公差",
        symbol: "h",
    },
    {
        name: "全跳动公差",
        symbol: "t",
    },
]
export const GelToleranceSymbol = GeoToleranceEntity.map((item: IEntity) => item.symbol);

export const enum CriteriaTypeEnum { SizedType, GeoToleranceType, SurfaceRoughnessType,  OtherRequirement };

export interface ICriteria {
    Id: number,
    CriteriaId: number,
    FirstType: number,
    SizeType?: number,
    SizeDelta?: number,
    SizeDeductScore?: number,
    GeoType?: string,
    GeoBase?: string,
    GeoDelta?: number,
    GeoDeductScore?: number,
    SurfaceRoughnessVal?: number,
    SurfaceRoughnessCount?:number,
    SurfaceRoughnessScore?: number, //decimal转成了string
    UnDeclaredChamferCount?: number,
    UnDeclaredChamferTotalVal?:number
}
export interface ICriteriaWithKey extends ICriteria {
    key: React.Key
}