import { Button, Form,  message, TableColumnsType, Tag } from 'antd';

import React, {  useEffect, useState } from 'react';
import { getComponentCriteriaTypes } from '../../api/comp';

import '../size/font.css';
import SizedInput from './criteriaInput/SizedInput';
import GeoToleranceInput from './criteriaInput/GeoToleranceInput';
import SurfaceRoughnessInput from './criteriaInput/SurfaceRoughnessInput';
import OtherInput from './criteriaInput/OtherInput';
import { saveExamCriteria } from '../../api/exam';

import '../size/font.css';

interface IProps {
    ExamComponent: number,
    ExamId: number,
    callback: ()=>void
}

//const enum CriteriaTypeEnum { SizedType, GeoToleranceType, SurfaceRoughnessType,  OtherRequirement };
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
const SizedEntity: IEntity[] = [
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
const GeoToleranceEntity: IEntity[] = [
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
const MapFunc = (entities: IEntity[], result: Map<string, string>) => {
    entities.map((entity) => {
        result.set(entity.symbol, entity.name)
    })
}
let GeoSymbolNameMap = new Map<string, string>();
MapFunc(GeoToleranceEntity, GeoSymbolNameMap);

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
    SurfaceRoughnessVal?:string,
    SurfaceRoughnessScore?: number,
    UnDeclaredChamferCount?: number,
    UnDeclaredChamferTotalVal?:number
}

interface DataType extends ICriteria {
    key: React.Key
}
export function generateCriteriaColumns() {
    const columns: TableColumnsType<DataType> = [
        {
            title: "类型", key: 'type', render: (_: any, criteria: ICriteria) => {
                if (criteria.FirstType === 0 && criteria.SizeType !== undefined) {
                    return <Tag> {SizedEntity[criteria.SizeType]['name']}</Tag>;
                }
                if (criteria.FirstType === 1 && criteria.GeoType) {
                    const currentElement = GeoToleranceEntity.filter(item => item['symbol'] === criteria.GeoType);
                    if (currentElement.length >= 1) {
                        return <Tag > {currentElement[0]['name']}</Tag>
                    }
                }
                if (criteria.FirstType === 2) {
                    return <Tag >表面粗糙度</Tag>
                }
                if (criteria.FirstType === 3) {
                    return <div>未注倒角</div>
                }
            }
        },
        {
            title: "符号", key: 'symbol', render: (_: any, criteria: ICriteria) => {
                if (criteria.FirstType === 0 && criteria.SizeType !== undefined) {
                    return <Tag> {SizedEntity[criteria.SizeType]['symbol']}</Tag>;
                }
                if (criteria.FirstType === 1 && criteria.GeoType) {
                    return <Tag className='gdt'>{criteria.GeoType}</Tag>
                }
                if (criteria.FirstType === 2) {
                    return <Tag >Ra{criteria.SurfaceRoughnessVal}</Tag>
                }
                if (criteria.FirstType === 3) {
                    return <div></div>
                }
            }
        },
        {
            title: '评测标准', key: 'criteriainfo', render: (_: any, criteria) => {
                if (criteria.FirstType === 0 && criteria.SizeDelta && criteria.SizeDeductScore) {
                    return <Tag>偏差范围以得分，偏差范围外每超差{criteria.SizeDelta}扣{criteria.GeoDeductScore}分，配分扣完为止</Tag>
                }
                if (criteria.FirstType === 1 && criteria.GeoBase && criteria.GeoDelta && criteria.GeoDeductScore) {
                    return <Tag>低于{criteria.GeoBase}得分，高于{criteria.GeoBase}每超差{criteria.GeoDelta}扣{criteria.GeoDeductScore}分，配分扣完为止</Tag>
                }
                if (criteria.FirstType === 2) {
                    return <Tag>样块对比目测，符合要求得分</Tag>
                }
                if (criteria.FirstType === 3 && criteria.UnDeclaredChamferCount && criteria.UnDeclaredChamferCount > 0) {
                    return <Tag>共计{criteria.UnDeclaredChamferCount}处，总共{criteria.UnDeclaredChamferTotalVal}分</Tag>
                }
            }
        }
    ]

    return columns;
}


export default function CreteriaV2(props: IProps) {
    const { ExamComponent, ExamId,callback } = props;
    const [surfaceRoughness, setSurfaceRoughness] = useState<IEntityRequired[]>([]);
    const [form] = Form.useForm();
    const genFields = (items: IEntityRequired[], targetSymbols: string[]) => {
        return items.map((item) => {
            const index = targetSymbols.indexOf(item.type);
            return ({
                val: item.type, //设置字段，在form.list下的form.item中指定的字段值
                fieldKey: index,
                isListField: true,
                key: index,
                name: index,
            })
        })
    }

    const genSurfFields = (items: IEntityRequired[])=>{
        return items.map((item:IEntityRequired, index:number)=>{
            return ({
                count: item.count, //设置字段，在form.list下的form.item中指定的字段值,
                size: item.size,
                fieldKey: index,
                isListField: true,
                key: index,
                name: index,
            })
        })
    }

    const getCriteriaMap = async (ComponentId: number) => {
        if (ComponentId === 0) {
            return [];
        }
        const res = await getComponentCriteriaTypes(ComponentId);
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`获取零件${ComponentId}的评测项失败，系统错误：${msg}`);
            return
        }
        console.log(`get data: ${JSON.stringify(data)}`);
        return data;

    }

    const fillData = (data: IEntityRequired[]) => {
        console.log(`into fillData: data ${JSON.stringify(data)}`);
        const sized = data.filter((item: IEntityRequired) =>
            SizedElementSymbol.includes(item.type) && item.required
        )
        const geo = data.filter((item: IEntityRequired) =>
            GelToleranceSymbol.includes(item.type) && item.required
        )
        const surfaceRoughness = data.filter((item: IEntityRequired) => item.type === "Ra" && item.required);
        setSurfaceRoughness(surfaceRoughness);
        form.setFieldsValue({
            SizedElement: genFields(sized, SizedElementSymbol),
            GeoElement: genFields(geo, GelToleranceSymbol),
            surfaceRoughnessElement: genSurfFields(surfaceRoughness)
        });
        // //踩坑记录：本来已经await请求拿到结果了，
        // //但是在设置form数据的时候由于先调了一遍setState  
        // // 然后再拿setState之后的数据来填充，由于setState总是异步执行，最终form的展示总是慢一拍。
        // // 解决方案是不再使用setState，拿到数据以后直接用！！！
        // form.setFieldsValue({
        //   SizedElement: genFields(sizedElementList, SizedElementSymbol),
        //   GeoElement: genFields(geoElementList, GelToleranceSymbol)
        // });
    }


    useEffect(() => {
        async function fetch() {
            const data = await getCriteriaMap(ExamComponent);
            fillData(data);
        }
        fetch()
        // getCriteriaMap(); //todo  数据总是拿到上一个的
    }, [ExamComponent]);

    const onFinish = async (values: any) => {
        console.log('Received values of form:', values);

        const res = await saveExamCriteria(values, ExamId);
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`保存考核标准失败，系统错误：${msg}`);
            return
        }
        message.success(`保存考核标准成功`);
        callback()

    };

    return (
        <div>

            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off"
            >
                <SizedInput SizedEntity={SizedEntity} />
                <GeoToleranceInput GeoToleranceEntity={GeoToleranceEntity} />
                <SurfaceRoughnessInput surfaceRoughness={surfaceRoughness}/>
                <OtherInput />
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )
}
