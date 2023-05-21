import { Button, message, Popconfirm } from 'antd'
import React from 'react'
import { deleteComponent } from '../../api/comp';
import { IDeleteComponentProps } from '../../interfaces/Component';

export default function DeleteComponentFC(props:IDeleteComponentProps) {
  const {ComponentId, onDelete} = props;
  const confirmDeleteComponent = async()=>{
    const res = await deleteComponent(ComponentId);
      if(!res) return;
      onDelete(ComponentId);//通知父组件删除
  }
  const cancel = ()=>{
    message.info('取消删除操作');
  }
  return (
    <div>
      <Popconfirm
        title={"删除零件后零件尺寸及相关考核数据均不可恢复，确认删除？"}
        onConfirm={confirmDeleteComponent}
        onCancel={cancel}
      >
        <Button type="primary" danger>删除</Button>
      </Popconfirm>
    </div>
  )
}
