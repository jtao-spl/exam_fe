import { Button, Form } from 'antd';

import React, {  useEffect, useState } from 'react';
import { getComponentCriteriaTypes } from '../../api/comp';

import '../size/font.css';
import SizedInput from './criteriaInput/SizedInput';
import GeoToleranceInput from './criteriaInput/GeoToleranceInput';
import SurfaceRoughnessInput from './criteriaInput/SurfaceRoughnessInput';
import OtherInput from './criteriaInput/OtherInput';
import { saveExamCriteria } from '../../api/exam';

import '../size/font.css';
import { ICriteriaProps } from '../../interfaces/Exam';
import { GelToleranceSymbol, GeoToleranceEntity, IEntity, IEntityRequired, SizedElementSymbol, SizedEntity } from '../../interfaces/ExamCriteria';


const MapFunc = (entities: IEntity[], result: Map<string, string>) => {
    entities.map((entity) => {
        result.set(entity.symbol, entity.name)
    })
}
let GeoSymbolNameMap = new Map<string, string>();
MapFunc(GeoToleranceEntity, GeoSymbolNameMap);


export default function CreteriaV2(props: ICriteriaProps) {
    const { ExamComponent, ExamId,callback } = props;
    const [surfaceRoughness, setSurfaceRoughness] = useState<IEntityRequired[]>([]);
    const [unDeclaredChamferCount, setUnDeclaredChamferCount] = useState(0);
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
        return res;

    }

    const fillData = (data: IEntityRequired[]) => {
        const sized = data.filter((item: IEntityRequired) =>
            SizedElementSymbol.includes(item.type) && item.required
        )
        const geo = data.filter((item: IEntityRequired) =>
            GelToleranceSymbol.includes(item.type) && item.required
        )
        const other = data.filter((item: IEntityRequired)=>item.type==='other' && item.required)
        if(other.length > 0){
            setUnDeclaredChamferCount(other[0].count)
        }
        const surfaceRoughness = data.filter((item: IEntityRequired) => item.type === "Ra" && item.required);
        setSurfaceRoughness(surfaceRoughness);
        form.setFieldsValue({
            SizedElement: genFields(sized, SizedElementSymbol),
            GeoElement: genFields(geo, GelToleranceSymbol),
            surfaceRoughnessElement: genSurfFields(surfaceRoughness),
            UnDeclaredChamferCount: other.length > 0? other[0].count: 0
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
        const res = await saveExamCriteria(values, ExamId);
        if (!res) return;
        callback()
    };

    return (
        <div>

            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off"
            >
                <SizedInput SizedEntity={SizedEntity} />
                <GeoToleranceInput GeoToleranceEntity={GeoToleranceEntity} />
                <SurfaceRoughnessInput surfaceRoughness={surfaceRoughness}/>
                <OtherInput count={unDeclaredChamferCount}/>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )
}
