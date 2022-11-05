import { Button, Form, InputNumber, message, Modal, Space, Tag } from 'antd';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { getComponentCriteriaTypes } from '../../api/comp';

import '../size/font.css';
import SizedInput from './criteriaInput/SizedInput';
import GeoToleranceInput from './criteriaInput/GeoToleranceInput';
import SurfaceRoughnessInput from './criteriaInput/SurfaceRoughnessInput';
import OtherInput from './criteriaInput/OtherInput';
import { saveExamCriteria } from '../../api/exam';

interface IProps {
  visible: boolean,
  ExamComponent: number,
  ExamId: number,
  cancel: () => void,

}

//const enum CriteriaTypeEnum { SizedType, GeoToleranceType, SurfaceRoughnessType,  OtherRequirement };
export interface IEntity {
  name: string,
  symbol: string
}
export interface IEntityRequired {
  type: string,
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
export default function Creterial(props: IProps) {
  const { visible, ExamComponent, ExamId, cancel } = props;

  const onCancel = () => {
    cancel();
  }


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

  const fillData = (data: IEntityRequired[])=>{
    console.log(`into fillData: data ${JSON.stringify(data)}`);
    const sized = data.filter((item: IEntityRequired) =>
      SizedElementSymbol.includes(item.type) && item.required
    )
    const geo = data.filter((item: IEntityRequired) =>
      GelToleranceSymbol.includes(item.type) && item.required
    )
    const surfaceRoughnessRequired = data.filter((item: IEntityRequired) => item.type === "Ra" && item.required).length>=0?true:false;
    form.setFieldsValue({
      SizedElement: genFields(sized, SizedElementSymbol),
      GeoElement: genFields(geo, GelToleranceSymbol),
      surfaceRoughnessRequired: surfaceRoughnessRequired
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
    message.success(`保存成功`);
    onCancel();

  };

  return (
    <div>
      <Modal
        title="设置评测标准"
        footer={null}
        width={"80vw"}
        open={visible}
        onCancel={onCancel}
      >
        <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off"
        >
          <SizedInput SizedEntity={SizedEntity} />
          <GeoToleranceInput GeoToleranceEntity={GeoToleranceEntity} />
          <SurfaceRoughnessInput  form={form} />
          <OtherInput />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )
}
