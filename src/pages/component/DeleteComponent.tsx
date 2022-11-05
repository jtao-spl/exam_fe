import { Button, message, Popconfirm } from 'antd'
import React, { Component } from 'react'
import { deleteComponent } from '../../api/comp';
interface IProps {
  ComponentId: number,
  onDelete: (id: number) => void

}

export default function DeleteComponentFC(props:IProps) {
  const {ComponentId, onDelete} = props;
  const confirmDeleteComponent = async()=>{
    const res = await deleteComponent(ComponentId);
      const { msg } = res.data;
      if (msg !== "success") {
        message.error(`删除零件失败:${msg}`);
        return
      }
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
