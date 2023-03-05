import { Modal, Table } from 'antd'
import React from 'react'
import { IShowSizeListProps } from '../../interfaces/Component';
import {  ISize } from '../../interfaces/Size';
import { generateSizeTableColumns } from '../../wrapper/Size';

import '../size/font.css';


export default function ShowSizeListFC(props:IShowSizeListProps) {
    const {visible, cancel, sizeList} = props;
    const onCancel = ()=>{
        cancel()
    }
    const generateTable = (sizeList:any) =>{
        const columns = generateSizeTableColumns();
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
