export interface ITeacher {
    Id: number,
    Name: string,
    Phone: number,
    Deleted: boolean
}
export interface ITeacherWithKey extends ITeacher {
    key: React.Key
}

export interface ITeacherListResp {
    teachers: ITeacher[],
    pageSize: number,
    total: number,

}

export interface ITeacherTableProps {
    teachers: ITeacher[],
    callback: () => void,
    pageSize: number,
    total: number,
    loading: boolean,
    refreshCallback: (pageNum: number) => void, //换页时的回调
}

export interface IAddTeacherProps {
    open: boolean,
    callback: () => void
}