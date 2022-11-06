import { Badge, Button, Modal, Table, TableColumnsType, Tag } from 'antd'
import React, { Component } from 'react'
import { generateSizeTableColumns, ISize } from '../size/SizeList'

import '../size/font.css';
import { useNavigate } from 'react-router-dom';

interface IProps{
    visible: boolean,
    cancel:()=>void,
    sizeList: ISize[]
}
interface DataType extends ISize {
    key: React.Key //在ISize基础上 多加一个key属性
}

export default function ShowSizeListFC(props:IProps) {
    const {visible, cancel, sizeList} = props;
    const navigate = useNavigate();
    const onCancel = ()=>{
        cancel()
    }
    const generateTable = (sizeList:any) =>{
        const columns = generateSizeTableColumns();
        sizeList.sort((a:ISize, b:ISize)=>{return a.FirstType - b.FirstType})
        return <Table columns={columns} dataSource={sizeList} pagination={false} scroll={{ y: 400 }} />;
      }

  return (
    <div>
        <Modal
        title="展示零件尺寸"
        centered={true}
        width={"80vw"}
        open={visible}
        footer={null}
        onCancel={onCancel}
        >   <Button type='primary' onClick={()=>navigate('/size')}>去编辑</Button>
            {generateTable(sizeList)}
            注1：此处仅展示数据，更改数据请到【尺寸列表】。<br />
            注2：自由公差线性尺寸的等级可在创建考核时设置。
        </Modal>
    </div>
  )
}



// export default class ShowSizeList extends Component<IProps> {
//     cancel= ()=>{
//         this.props.cancel();
//     }

//     generateTable = (sizeList:any) =>{
//         const columns:TableColumnsType<DataType> =[
//             // {title: "Id", dataIndex :"Id", key: "Id"},
//             //function(text, record, index) {}
//             {title: "项目",key: "FirstType", render: (_, record)=>{
//                 console.log(`record: ${record}`);
//                 if(record.FirstType === 0){
//                     return <Tag color={record.Color}>零件尺寸检验</Tag>
//                 }
//                 if(record.FirstType === 1){
//                     return <Tag color={record.Color}>形位公差</Tag>
//                 }
//                 if(record.FirstType === 2){
//                     return <Tag color={record.Color}>表面粗糙度</Tag>
//                 }
//                 if(record.FirstType === 3){
//                     return <Tag color={record.Color}>其他</Tag>
//                 }
//                 return <Badge status='success' />
//             }},
//             {title:'类型', key:'SubType', render: (_, record)=>{
//                 if (record.FirstType === 0){
//                     if(record.SecondType === 0){
//                         return <Tag>L</Tag>
//                     }
//                     if(record.SecondType && record.SecondType === 1){
//                         return <Tag>D</Tag>
//                     }
//                     if(record.SecondType && record.SecondType === 2){
//                         return <Tag>R</Tag>
//                     }
//                     if(record.SecondType && record.SecondType === 3){
//                         return <Tag>∠</Tag>
//                     }
//                 }
//                 if (record.FirstType === 1){
//                     return(<Tag className='gdt'>{record.GeoToleranceType}</Tag>)
//                 }
//                 if (record.FirstType === 2){
//                     return(<Tag>Ra</Tag>)
//                 }
//             }},
//             {title: "基准值", key: 'baseValue', render:(_, record)=>{
//                 if (record.FirstType === 0){
//                     return <Tag>{record.BaseSize}</Tag>
//                 }
//                 if (record.FirstType === 1){
//                     return <Tag >{record.GeoToleranceVal}</Tag>
//                 }
//                 if (record.FirstType === 2){
//                     return <Tag >{record.SurfaceRoughnessVal}</Tag>
//                 }
//                 if (record.FirstType === 3){
//                     return <Tag >{record.OtherRequirements}</Tag>
//                 }

//             }},
//             {
//                 title: "上偏差",
//                 key: 'upDelta',
//                 render: (_,record)=>{
//                     if (record.FirstType === 0){
//                         return <Tag>{record.UpSize}</Tag>
//                     }
//                     if (record.FirstType === 1){
//                         return <Tag>0</Tag>
//                     }
//                     if (record.FirstType === 2){
//                         return (<Tag>-</Tag>)
//                     }
//                 }
//             },
//             {
//                 title: "下偏差",
//                 key: 'bottomDelta',
//                 render: (_,record)=>{
//                     if (record.FirstType === 0){
//                         return <Tag>{record.BottomSize}</Tag>
//                     }
//                     if (record.FirstType === 1){
//                         return <Tag>{'-'+record.GeoToleranceVal}</Tag>
//                     }
//                     if (record.FirstType === 2){
//                         return (<Tag>-</Tag>)
//                     }
//                 }
//             },
//             {
//                 title: "上极限尺寸",
//                 key: 'UpSize',
//                 render: (_,record)=>{
//                     if (record.FirstType === 0){
//                         if (record.BaseSize && record.UpSize){
//                             return <Tag>{Number(record.BaseSize) + Number(record.UpSize)}</Tag>
//                         }
//                         return  <Tag>{"NaN"}</Tag>
//                     }
//                     if (record.FirstType === 1){
//                         return <Tag>{record.GeoToleranceVal}</Tag>
//                     }
//                     if (record.FirstType === 2){
//                         return (<Tag>-</Tag>)
//                     }
//                 }
//             },
//             {
//                 title: "下极限尺寸",
//                 key: 'bottomSize',
//                 render: (_,record)=>{
//                     if (record.FirstType === 0){
//                         if (record.BaseSize && record.BottomSize){
//                             return <Tag>{Number(record.BaseSize) + Number(record.BottomSize)}</Tag>
//                         }
//                         return <Tag>{"NaN"}</Tag>
//                     }
//                     if (record.FirstType === 1){
//                         return <Tag>0</Tag>
//                     }
//                     if (record.FirstType === 2){
//                         return (<Tag>-</Tag>)
//                     }
//                 }
//             }
//         ]
//         sizeList.sort((a:ISize, b:ISize)=>{return a.FirstType - b.FirstType})
//         return <Table columns={columns} dataSource={sizeList} pagination={false} scroll={{ y: 400 }} />;
//       }

//   render() {
//     return (
//       <div>
//         <Modal
//         title="展示零件尺寸"
//         centered={true}
//         width={"80vw"}
//         open={this.props.visible}
//         footer={null}
//         onCancel={this.cancel}
//         onOk={this.cancel}>
//             {this.generateTable(this.props.sizeList)}
//             注1：此处仅展示数据，更改数据请到【尺寸列表】。<br />
//             注2：自由公差线性尺寸的等级可在创建考核时设置。
//         </Modal>
//       </div>
//     )
//   }
// }