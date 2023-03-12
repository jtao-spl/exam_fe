import { Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getComponentById } from '../../api/comp';
import { REACT_APP_BASE_API } from '../../config/default';
import { IComponent } from '../../interfaces/Component';
import { ISize } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';
import { generateSizeTableColumns } from '../../wrapper/Size';


export default function ComponentDetail() {
    const params = useParams();
    let id = 0;
    if (params.id) {
        id = Number.parseInt(params.id);
    }
    const [sizeList, setSizeList] = useState<ISize[]>([]);
    const [component, setComponent] = useState<IComponent>();

    const init = async () => {
        const sizes = await getSizesByComponentId(id);
        setSizeList(sizes);
        const component = await getComponentById(id);
        setComponent(component)
    }

    const generateSizeTable = (sizes: any) => {
        const allColumns = generateSizeTableColumns();
        const OmitComponentIdColumns = allColumns.filter((item: any) => item.key !== 'ComponentId')
        return <Table
            rowKey={record=>record.Id}
            bordered
            dataSource={sizes}
            columns={OmitComponentIdColumns}
            pagination={false}
            scroll={{ y: 400 }}
        />
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <div>
            <Space direction='vertical'>
                <div>零件名称：</div>
                <Tag>{component?.ComponentName}</Tag>
            </Space>
            <Space direction='vertical'>
                <div>零件图样</div>
                <img alt="零件图样" src={`${REACT_APP_BASE_API}${component?.ClipPath}`} />
            </Space>
            <Space direction='vertical'>
                <div>尺寸数据</div>
                {sizeList && generateSizeTable(sizeList)}
            </Space>
        </div>
    )
}
