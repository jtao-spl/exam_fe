import { Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { REACT_APP_BASE_API } from '../../config/default';
import { generateSizeTableColumns, ISize } from '../size/SizeList';
import { IComponent } from './ComponentList';
import { getComponent, getSizesByComponentId } from './EditComponentV2';

export default function ComponentDetail() {

    const params = useParams();

    let id = 0;
    if (params.id) {
        id = Number.parseInt(params.id);
    }

    const [sizeList, setSizeList] = useState<ISize[]>();
    const [component, setComponent] = useState<IComponent>();

    const init = async () => {
        const sizes = await getSizesByComponentId(id);
        if (sizes) {
            setSizeList(sizes);
        }
        const component = await getComponent(id);
        if (component) {
            setComponent(component)
        }
    }
    const generateSizeTable = (sizes: any) => {
        const allColumns = generateSizeTableColumns();
        const OmitComponentIdColumns = allColumns.filter((item: any) => item.key !== 'ComponentId')
        sizes.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType })
        return <Table
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
