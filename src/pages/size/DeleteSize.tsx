import { Button, message, Popconfirm } from 'antd'
import React from 'react'
import { deleteSize } from '../../api/size'
import { IDelteSizeProps } from '../../interfaces/Size';

export default function DeleteSize(props: IDelteSizeProps) {
  const { size, refresh, isAggSizeDeletable } = props;
  const confirmDeleteSize = async () => {
    if (!size?.Id) {
      message.error(`删除失败，无法确定删除的尺寸id`);
      return
    }
    await deleteSize(size.Id);
    refresh(size.Id);
  }
  const cancel = () => {
    message.info('取消删除操作');
  }
  if (!size) {
    return (<div></div>)
  }

  return (
    <div>
      {[2, 3].includes(size.FirstType) && !isAggSizeDeletable && <Button type="primary" danger disabled={true}>删除</Button>}
      {(![2, 3].includes(size.FirstType) || isAggSizeDeletable) &&
        <Popconfirm
          title="删除后已存储的相关考核项数据会出现不一致，确认删除？"
          onConfirm={confirmDeleteSize}
          onCancel={cancel}
        >
          <Button type="primary" danger disabled={[2, 3].includes(size.FirstType) && !isAggSizeDeletable}>删除</Button>
        </Popconfirm>
      }
    </div>
  )

}
