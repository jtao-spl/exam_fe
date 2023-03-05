// import { Button, Space, Table, TableColumnsType, Tag } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { getComponentCount, getComponentList } from '../../api/comp';
// import { getSizeList } from '../../api/size';
// import { IComponent } from '../../interfaces/Component';
// import { ISize } from '../../interfaces/Size';
// import { getComponentListForFilter } from '../../wrapper/Component';
// import { generateSizeTableColumns } from '../../wrapper/Size';
// import AddSize from './AddSize';
// import DeleteSize from './DeleteSize';
// import EditSize from './EditSize';

// import './font.css';

// export default function SizeList() {
//     const [sizeList, setSizeList] = useState<ISize[]>([]);
//     const [componentId, setComponentId] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [pageSize, setPageSize] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [size, setSize] = useState<ISize>();
//     const [componentList, setComponentList] = useState<IComponent[]>([]);
//     const [showUpdateSizeModal, setShowUpdateSizeModal] = useState(false);
//     const [showAddSieModal, setShowAddSieModal] = useState(false);

//     const getSizeListFunc = async (pg: number = 1, lim: number = 10, compId: number = 0) => {
//         const res = await getSizeList(pg, lim, compId);
//         if(res){
//             setSizeList(res.sizes);
//             setPageSize(res.pageSize);
//             setTotal(res.total);
//             setLoading(false);
//         }
//         if (componentList.length === 0) {
//             const componentList = await getComponentListForFilter();
//             setComponentList(componentList);
//         }
//     }

//     const onChange = async (pagenation: any, filters?: any) => {
//         let cId = componentId
//         if (filters) {
//             if (filters.ComponentId) {
//                 cId = filters.ComponentId[0];
//             }
//             if (!filters.ComponentId) {
//                 cId = 0;
//             }
//             setComponentId(cId);
//         }
//         getSizeListFunc(pagenation.current, 10, cId);
//     }

//     useEffect(() => { getSizeListFunc() }, [])

//     const displayUpdateSizeModal = (size: ISize) => {
//         setShowUpdateSizeModal(true);
//         setSize(size);
//     }
//     const hideUpdateSizeModal = (refresh?: boolean) => {
//         if (refresh) {
//             getSizeListFunc();
//         }
//         setShowUpdateSizeModal(false);
//     }
//     const displayShowAddSizeModal = () => {
//         setShowAddSieModal(true);
//     }
//     const hideAddSizeModal = (refresh?: boolean) => {
//         if (refresh) {
//             getSizeListFunc();
//         }
//         setShowAddSieModal(false);
//     }
//     const generateSizeTable = (sizes: ISize[]) => {
//         const columns: TableColumnsType<ISize> = [
//             ...generateSizeTableColumns(),
//             {
//                 title: "操作", key: "operation", render: (_: any, size: ISize) => (
//                     <Space>
//                         <Button type='primary'
//                             onClick={() => { displayUpdateSizeModal(size) }}
//                         >编辑</Button>
//                         <DeleteSize size={size} refresh={onChange} isAggSizeDeletable={true} />
//                     </Space>
//                 )
//             }
//         ];
//         return <Table
//             loading={loading}
//             dataSource={sizes}
//             columns={columns}
//             pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
//             scroll={{ y: 400 }}
//             onChange={onChange} />

//     }
//     return (
//         <div>
//             <Button type='primary' onClick={displayShowAddSizeModal} >添加尺寸</Button>
//             <AddSize
//                 visible={showAddSieModal}
//                 componentList={componentList}
//                 callback={hideAddSizeModal}
//             />
//             <EditSize
//                 visible={showUpdateSizeModal}
//                 size={size}
//                 cancel={hideUpdateSizeModal}
//             />
//             {sizeList && generateSizeTable(sizeList)}

//         </div>
//     )

// }
import React from 'react'

export default function SizeList() {
  return (
    <div>SizeList</div>
  )
}

