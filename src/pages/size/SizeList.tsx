import { Button, Space, Table, TableColumnsType, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { getComponentCount, getComponentList } from '../../api/comp';
import { getSizeList } from '../../api/size';
import { IComponent } from '../component/ComponentList';
import AddSize from './AddSize';
import DeleteSize from './DeleteSize';
import EditSize from './EditSize';

import './font.css';

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
interface DataType extends ISize {
    key: React.Key,
}
// export interface ISizeWithExtAttr extends ISize{
//     count: number
// }
// interface DataTypeExt extends ISizeWithExtAttr{
//     key: React.Key
// }

export function generateSizeTableColumns() {
    const columns: TableColumnsType<DataType> = [
        { title: "零件ID", key: 'ComponentId', dataIndex: 'ComponentId' },
        { title: "尺寸ID", key: 'SizeId', dataIndex: 'Id' },
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
            }
        },
        {
            title: '类型', key: 'SubType', render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
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
                if (record.FirstType === 1) {
                    return (<Tag className='gdt'>{record.GeoToleranceType}</Tag>)
                }
                if (record.FirstType === 2) {
                    return (<Tag>Ra{record.SurfaceRoughnessVal}</Tag>)
                }
                if (record.FirstType === 3) {
                    return (<Tag>-</Tag>)
                }
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
            }
        },
        {
            title: "上极限尺寸",
            key: 'UpSize',
            render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    if (record.BaseSize && record.UpSize) {
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
            }
        },
        {
            title: "下极限尺寸",
            key: 'bottomSize',
            render: (_: any, record: ISize) => {
                if (record.FirstType === 0) {
                    if (record.BaseSize && record.BottomSize) {
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
            }
        }
    ]
    return columns;
}

/**
 * 数据聚合展示的表格，表面粗糙度和未注倒角 按数量进行算分
 * @returns 
 */
// export function generateAggreatedSizeTableColumns() {
//     const columns: TableColumnsType<DataTypeExt> = [
//         { title: "零件ID", key: 'ComponentId', dataIndex: 'ComponentId' },
//         { title: "尺寸ID", key: 'SizeId', dataIndex: 'Id' },
//         {
//             title: "项目", key: "FirstType", render: (_: any, size: ISizeWithExtAttr) => {
//                 if (size.FirstType === 0) {
//                     return <Tag color={size.Color}>零件尺寸检验</Tag>
//                 }
//                 if (size.FirstType === 1) {
//                     return <Tag color={size.Color}>形位公差</Tag>
//                 }
//                 if (size.FirstType === 2) {
//                     return <Tag color={size.Color}>表面粗糙度</Tag>
//                 }
//                 if (size.FirstType === 3) {
//                     return <Tag color={size.Color}>未注倒角</Tag>
//                 }
//             }
//         },
//         {
//             title: '类型', key: 'SubType', render: (_: any, record: ISizeWithExtAttr) => {
//                 if (record.FirstType === 0) {
//                     if (record.SecondType === 0) {
//                         return (<Tag>L</Tag>)
//                     }
//                     if (record.SecondType && record.SecondType === 1) {
//                         return (<Tag>D</Tag>)
//                     }
//                     if (record.SecondType && record.SecondType === 2) {
//                         return (<Tag>R</Tag>)
//                     }
//                     if (record.SecondType && record.SecondType === 3) {
//                         return (<Tag>∠</Tag>)
//                     }
//                 }
//                 if (record.FirstType === 1) {
//                     return (<Tag className='gdt'>{record.GeoToleranceType}</Tag>)
//                 }
//                 if (record.FirstType === 2) {
//                     return (<Tag>Ra{record.SurfaceRoughnessVal}</Tag>)
//                 }
//                 if (record.FirstType === 3) {
//                     return (<Tag>-</Tag>)
//                 }
//             }
//         },
//         {
//             title: "基准值", key: 'baseValue', render: (_: any, record: ISizeWithExtAttr) => {
//                 if (record.FirstType === 0) {
//                     return <Tag>{record.BaseSize}</Tag>
//                 }
//                 if (record.FirstType === 1) {
//                     return <Tag >{record.GeoToleranceVal}</Tag>
//                 }
//                 if (record.FirstType === 2) {
//                     return <Tag >{record.count}处</Tag>
//                 }
//                 if (record.FirstType === 3) {
//                     return <Tag >{record.UnDeclaredChamferCount}处</Tag>
//                 }
//             },
//         },
//         {
//             title: "上偏差",
//             key: 'upDelta',
//             render: (_: any, record: ISizeWithExtAttr) => {
//                 if (record.FirstType === 0) {
//                     return <Tag >{record.UpSize}</Tag>
//                 }
//                 if (record.FirstType === 1) {
//                     return <Tag>-</Tag>
//                 }
//                 if (record.FirstType === 2) {
//                     return (<Tag>-</Tag>)
//                 }
//             }
//         },
//         {
//             title: "下偏差",
//             key: 'bottomDelta',
//             render: (_: any, record: ISizeWithExtAttr) => {
//                 if (record.FirstType === 0) {
//                     return <Tag>{record.BottomSize}</Tag>
//                 }
//                 if (record.FirstType === 1) {
//                     return <Tag>-</Tag>
//                 }
//                 if (record.FirstType === 2) {
//                     return (<Tag>-</Tag>)
//                 }
//             }
//         },
//         {
//             title: "上极限尺寸",
//             key: 'UpSize',
//             render: (_: any, record: ISizeWithExtAttr) => {
//                 if (record.FirstType === 0) {
//                     if (record.BaseSize && record.UpSize) {
//                         return <Tag>{Number(record.BaseSize) + Number(record.UpSize)}</Tag>
//                     }
//                     return <Tag>{"NaN"}</Tag>
//                 }
//                 if (record.FirstType === 1) {
//                     return <Tag>-</Tag>
//                 }
//                 if (record.FirstType === 2) {
//                     return (<Tag>-</Tag>)
//                 }
//             }
//         },
//         {
//             title: "下极限尺寸",
//             key: 'bottomSize',
//             render: (_: any, record: ISizeWithExtAttr) => {
//                 if (record.FirstType === 0) {
//                     if (record.BaseSize && record.BottomSize) {
//                         return <Tag>{Number(record.BaseSize) + Number(record.BottomSize)}</Tag>
//                     }
//                     return <Tag>{"NaN"}</Tag>
//                 }
//                 if (record.FirstType === 1) {
//                     return <Tag>-</Tag>
//                 }
//                 if (record.FirstType === 2) {
//                     return (<Tag>-</Tag>)
//                 }
//             }
//         }
//     ]
//     return columns;
// }
// /**
//  * 将尺寸列表中的表面粗糙度按值进行数量的聚合
//  * @param sizes 
//  * @returns 
//  */
// export function aggregateSizes(sizes:ISize[]):ISizeWithExtAttr[]{
//     const surf = sizes.filter((size:ISize)=>size.FirstType === 2);
//     const other = sizes.filter((size:ISize)=>size.FirstType !== 2);
//     const surfSize = surf.map((size:ISize)=>size.SurfaceRoughnessVal?size.SurfaceRoughnessVal: '')
//     const uniqSize = Array.from(new Set(surfSize));
//     let surfAgg:ISizeWithExtAttr[] = []
//     uniqSize.forEach((val:string)=>{
//         const current = surf.filter((size:ISize)=>size.SurfaceRoughnessVal === val);
//         if(current.length > 0){
//             return surfAgg.push({...current[0], count:current.length})
//         }
//     })
//     const otherExt = other.map((size:ISize)=>({...size, count: 1}));
//     return [...surfAgg, ...otherExt];
// }

export default function SizeList() {
    const [sizeList, setSizeList] = useState<ISize[]>([]);
    const [componentId, setComponentId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState<ISize>();
    const [componentList, setComponentList] = useState<IComponent[]>([]);
    const [showUpdateSizeModal, setShowUpdateSizeModal] = useState(false);
    const [showAddSieModal, setShowAddSieModal] = useState(false);

    const getSizeListFunc = async (pg: number = 1, lim: number = 10, compId: number = 0) => {
        const res = await getSizeList(pg, lim, compId);
        const { data, limit, total } = res.data;
        if (componentList.length === 0) {
            const componentList = await getComponentListForFilter();
            setComponentList(componentList);
        }
        data.map((size: ISize) => {
            size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
            return size
        })
        setSizeList(data);
        setPageSize(limit);
        setTotal(total);
        setLoading(false);
    }

    const onChange = async (pagenation: any, filters?: any) => {
        let cId = componentId
        if (filters) {
            console.log(`filter触发刷新数据:${JSON.stringify(filters)}`);
            if (filters.ComponentId) {
                cId = filters.ComponentId[0];
            }
            if (!filters.ComponentId) {
                cId = 0;
            }
            setComponentId(cId);
        }
        getSizeListFunc(pagenation.current, 10, cId);
    }

    useEffect(() => { getSizeListFunc() }, [])

    const getComponentListForFilter = async () => {
        const res1 = await getComponentCount();
        const { count } = res1.data.data;
        const res = await getComponentList(1, count);
        const { data } = res.data;
        return data;
    }
    const displayUpdateSizeModal = (size: ISize) => {
        console.log(`show modal, size: ${JSON.stringify(size)}`);
        setShowUpdateSizeModal(true);
        setSize(size);
    }
    const hideUpdateSizeModal = (refresh?: boolean) => {
        if (refresh) {
            getSizeListFunc();
        }
        setShowUpdateSizeModal(false);
    }
    const displayShowAddSizeModal = () => {
        setShowAddSieModal(true);
    }
    const hideAddSizeModal = (refresh?: boolean) => {
        if (refresh) {
            getSizeListFunc();
        }
        setShowAddSieModal(false);
    }
    const generateSizeTable = (sizes: any) => {
        const columns: TableColumnsType<DataType> = [
            ...generateSizeTableColumns(),
            {
                title: "操作", key: "operation", render: (_: any, size: ISize) => (
                    <Space>
                        <Button type='primary'
                            onClick={() => { displayUpdateSizeModal(size) }}
                        >编辑</Button>
                        <DeleteSize size={size} refresh={onChange} isAggSizeDeletable={true}/>
                    </Space>
                )
            }
        ];
        sizes.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType })
        return <Table
            loading={loading}
            dataSource={sizes}
            columns={columns}
            pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
            scroll={{ y: 400 }}
            onChange={onChange} />

    }
    return (
        <div>
            <Button type='primary' onClick={displayShowAddSizeModal} >添加尺寸</Button>
            <AddSize
                visible={showAddSieModal}
                componentList={componentList}
                callback={hideAddSizeModal}
            />
            <EditSize
                visible={showUpdateSizeModal}
                size={size}
                cancel={hideUpdateSizeModal}
            />
            {sizeList && generateSizeTable(sizeList)}
            
        </div>
    )

}
