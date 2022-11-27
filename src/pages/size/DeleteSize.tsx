import { Button, message, Popconfirm } from 'antd'
import React from 'react'
import { deleteSize } from '../../api/size'
import { ISize } from './SizeList'
interface IProps {
  size?: ISize
  refresh: (id: number) => void

}
export default function DeleteSize(props: IProps) {
  const { size, refresh } = props;
  const confirmDeleteSize = async () => {
    if (!size?.Id) {
      message.error(`删除失败，无法确定删除的尺寸id`);
      return
    }
    const res = await deleteSize(size.Id);
    const { code, msg } = res.data;
    if (code === 0) {
      message.success('删除成功');
    }
    else {
      message.error(`删除失败，系统错误：${msg}`);
    }
    refresh(size.Id);
  }
  const cancel = () => {
    message.info('取消删除操作');
  }

  return (
    <div>
      <Popconfirm
        title="删除后已存储的相关考核项数据会出现不一致，确认删除？"
        onConfirm={confirmDeleteSize}
        onCancel={cancel}
      >
        <Button type="primary" danger>删除</Button>
      </Popconfirm>
    </div>
  )

}
