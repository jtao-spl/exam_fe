import { Modal, Table } from 'antd'
import React from 'react'
import { generateSizeTableColumns, ISize } from '../size/SizeList'

import '../size/font.css';

interface IProps{
    visible: boolean,
    cancel:()=>void,
    sizeList: ISize[]
}

export default function ShowSizeListFC(props:IProps) {
    const {visible, cancel, sizeList} = props;
    const onCancel = ()=>{
        cancel()
    }
    const generateTable = (sizeList:any) =>{
        const columns = generateSizeTableColumns();
        sizeList.sort((a:ISize, b:ISize)=>{return a.FirstType - b.FirstType})
        return <Table rowKey={record=>record.Id} columns={columns} dataSource={sizeList} pagination={false} scroll={{ y: 400 }} />;
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
        >  
            {generateTable(sizeList)}
        </Modal>
    </div>
  )
}
