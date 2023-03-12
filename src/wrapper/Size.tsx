import { TableColumnsType, Tag } from "antd"
import { ISize } from "../interfaces/Size"


/**
 * 零件尺寸表格的通用表字段定义
 * @returns 
 */
export function generateSizeTableColumns() {
    const columns: TableColumnsType<ISize> = [
        // { title: "零件ID", key: 'ComponentId', dataIndex: 'ComponentId' },
        // { title: "尺寸ID", key: 'SizeId', dataIndex: 'Id' },
        {
            title: "项目", key: "FirstType", render: (_: any, size: ISize) => {
                if (size.FirstType === 0) {
                    return <Tag color={size.Color}>零件尺寸检验</Tag>
                }
                if (size.FirstType === 1) {
                    return <Tag color={size.Color}>形位公差</Tag>
                }
                if (size.FirstType === 2) {
                    return <Tag color={size.Color}>表面粗糙度</Tag>
                }
                if (size.FirstType === 3) {
                    return <Tag color={size.Color}>未注倒角</Tag>
                }
                if (size.FirstType === 4) {
                    return <Tag color={size.Color}>安全文明生产</Tag>
                }
            }
        },
        {
            title: '类型', key: 'SubType', render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    if (record.SecondType === 0) {
                        return (<Tag>L</Tag>)
                    }
                    if (record.SecondType && record.SecondType === 1) {
                        if(record.DiameterType && record.DiameterType === 2){
                            return (<Tag>d</Tag>)
                        }
                        return (<Tag>D</Tag>)
                    }
                    if (record.SecondType && record.SecondType === 2) {
                        return (<Tag>R</Tag>)
                    }
                    if (record.SecondType && record.SecondType === 3) {
                        return (<Tag>∠</Tag>)
                    }
                }
                if (record.FirstType === 1) {
                    return (<Tag className='gdt'>{record.GeoToleranceType}</Tag>)
                }
                if (record.FirstType === 2) {
                    return (<Tag>Ra{record.SurfaceRoughnessVal}</Tag>)
                }
                if (record.FirstType === 3) {
                    return (<Tag>{record.UnDeclaredChamferCount}处</Tag>)
                }
                if (record.FirstType === 4) {
                    return (<Tag>{record.SafetyRequirement}</Tag>)
                }
            },
            onCell: (record: ISize) => {
                if (record.FirstType === 3 || record.FirstType === 4) { //安全文明生产项 或者未注倒角项
                    return { colSpan: 6 }
                }
                return { colSpan: 1 }
            }
        },
        {
            title: "基准值/数量", key: 'baseValue', render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    return <Tag>{record.BaseSize}</Tag>
                }
                if (record.FirstType === 1) {
                    return <Tag >{record.GeoToleranceVal}</Tag>
                }
                if (record.FirstType === 2) {
                    return <Tag >{record.SurfaceRoughnessCount}处</Tag>
                }
                if (record.FirstType === 3) {
                    return <Tag >{record.UnDeclaredChamferCount}处</Tag>
                }
            },
            onCell: (record: ISize) => {
                if (record.FirstType === 3 || record.FirstType === 4) {
                    return { colSpan: 0 }
                }
                if ([1, 2].includes(record.FirstType)) {
                    return { colSpan: 5 }
                }
                return { colSpan: 1 }
            }
        },
        {
            title: "上偏差",
            key: 'upDelta',
            render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    return <Tag >{record.UpSize}</Tag>
                }
                if (record.FirstType === 1) {
                    return <Tag>-</Tag>
                }
                if (record.FirstType === 2) {
                    return (<Tag>-</Tag>)
                }
            },
            onCell: (record: ISize) => {
                if (record.FirstType !== 0) {
                    return { colSpan: 0 }
                }
                return { colSpan: 1 }
            }
        },
        {
            title: "下偏差",
            key: 'bottomDelta',
            render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    return <Tag>{record.BottomSize}</Tag>
                }
                if (record.FirstType === 1) {
                    return <Tag>-</Tag>
                }
                if (record.FirstType === 2) {
                    return (<Tag>-</Tag>)
                }
            },
            onCell: (record: ISize) => {
                if (record.FirstType !== 0) {
                    return { colSpan: 0 }
                }
                return { colSpan: 1 }
            }
        },
        {
            title: "上极限尺寸",
            key: 'UpSize',
            render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    if (record.BaseSize !== undefined && record.UpSize !== undefined) {
                        return <Tag>{Number(record.BaseSize) + Number(record.UpSize)}</Tag>
                    }
                    return <Tag>{"NaN"}</Tag>
                }
                if (record.FirstType === 1) {
                    return <Tag>-</Tag>
                }
                if (record.FirstType === 2) {
                    return (<Tag>-</Tag>)
                }
            },
            onCell: (record: ISize) => {
                if (record.FirstType !== 0) {
                    return { colSpan: 0 }
                }
                return { colSpan: 1 }
            }
        },
        {
            title: "下极限尺寸",
            key: 'bottomSize',
            render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    if (record.BaseSize !== undefined && record.BottomSize !== undefined) {
                        return <Tag>{Number(record.BaseSize) + Number(record.BottomSize)}</Tag>
                    }
                    return <Tag>{"NaN"}</Tag>
                }
                if (record.FirstType === 1) {
                    return <Tag>-</Tag>
                }
                if (record.FirstType === 2) {
                    return (<Tag>-</Tag>)
                }
            },
            onCell: (record: ISize) => {
                if (record.FirstType !== 0) {
                    return { colSpan: 0 }
                }
                return { colSpan: 1 }
            }
        }
    ]
    return columns;
}


export const SizeType = ['零件尺寸检验', '形位公差', '表面粗糙度', '未注倒角'];

export const generateParentTableColums = () => {
    const columns: TableColumnsType<any> = [
        { title: '项目', key: 'type', dataIndex: 'type' }
    ]
    return columns
}

export const generateSizedElementSubTableColumns = () => {
    const columns: TableColumnsType<ISize> = [
        {
            title: '尺寸类型', key: 'type', render: (_: any, record: ISize) => {

                if (record.SecondType === 0) {
                    return (<Tag>L</Tag>)
                }
                if (record.SecondType && record.SecondType === 1) {
                    return (<Tag>D</Tag>)
                }
                if (record.SecondType && record.SecondType === 2) {
                    return (<Tag>R</Tag>)
                }
                if (record.SecondType && record.SecondType === 3) {
                    return (<Tag>∠</Tag>)
                }
            }
        },
        { title: '公称尺寸', key: 'baseSize', render: (_: any, record: ISize) => (<Tag>{record.BaseSize}</Tag>) },
        { title: '上偏差', key: 'upbound', render: (_: any, record: ISize) => (<Tag>{record.UpSize}</Tag>) },
        { title: '下偏差', key: 'bottomBound', render: (_: any, record: ISize) => (<Tag>{record.BottomSize}</Tag>) },
        {
            title: '上极限尺寸', key: 'upSize', render: (_: any, record: ISize) => {
                if (record.BaseSize !== undefined && record.BottomSize !== undefined) {
                    return <Tag>{Number(record.BaseSize) + Number(record.BottomSize)}</Tag>
                }
                return <Tag>{"NaN"}</Tag>
            }
        },
        {
            title: '下极限尺寸', key: 'bottomSize', render: (_: any, record: ISize) => {
                if (record.BaseSize !== undefined && record.BottomSize !== undefined) {
                    return <Tag>{Number(record.BaseSize) + Number(record.BottomSize)}</Tag>
                }
                return <Tag>{"NaN"}</Tag>
            }
        },

    ]
    return columns;
}

export const generateGeoTolerateElementSubTableColumns = () => {
    const columns: TableColumnsType<ISize> = [
        {
            title: '公差类型', key: 'type', render: (_: any, record: ISize) => (<Tag className='gdt'>{record.GeoToleranceType}</Tag>)
        },
        { title: '公差精度', key: 'baseSize', render: (_: any, record: ISize) => (<Tag >{record.GeoToleranceVal}</Tag>) },
        { title: '上偏差', key: 'upbound', render: (_: any, record: ISize) => (<Tag>-</Tag>) },
        { title: '下偏差', key: 'bottomBound', render: (_: any, record: ISize) => (<Tag>-</Tag>) },
        {
            title: '上极限尺寸', key: 'upSize', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
        {
            title: '下极限尺寸', key: 'bottomSize', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
    ]
    return columns;
}

export const generateSurfaceRoughnessElementSubTableColumns = () => {
    const columns: TableColumnsType<ISize> = [
        {
            title: '粗糙度类别/值', key: 'type', render: (_: any, record: ISize) => (<Tag>Ra{record.SurfaceRoughnessVal}</Tag>)
        },
        { title: '数量', key: 'baseSize', render: (_: any, record: ISize) => (<Tag >{record.SurfaceRoughnessCount}处</Tag>) },
        { title: '上偏差', key: 'upbound', render: (_: any, record: ISize) => (<Tag>-</Tag>) },
        { title: '下偏差', key: 'bottomBound', render: (_: any, record: ISize) => (<Tag>-</Tag>) },
        {
            title: '上极限尺寸', key: 'upSize', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
        {
            title: '下极限尺寸', key: 'bottomSize', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
    ]
    return columns;
}
export const generateOtherElementSubTableColumns = () => {
    const columns: TableColumnsType<ISize> = [
        {
            title: '-', key: 'type', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
        { title: '数量', key: 'baseSize', render: (_: any, record: ISize) => (<Tag >{record.UnDeclaredChamferCount}处</Tag>) },
        { title: '上偏差', key: 'upbound', render: (_: any, record: ISize) => (<Tag>-</Tag>) },
        { title: '下偏差', key: 'bottomBound', render: (_: any, record: ISize) => (<Tag>-</Tag>) },
        {
            title: '上极限尺寸', key: 'upSize', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
        {
            title: '下极限尺寸', key: 'bottomSize', render: (_: any, record: ISize) => (<Tag>-</Tag>)
        },
    ]
    return columns;
}