import { Image, Modal, Table, TableColumnsType } from 'antd';
import React from 'react'
import { REACT_APP_BASE_API } from '../../config/default';
import { IExam } from '../../interfaces/Exam';
import { ISize } from '../../interfaces/Size';
import { IExamDetailProps } from '../../interfaces/Teacher'
import { generateCriteriaColumns } from '../../wrapper/Criteria';
import { generateSizeTableColumns } from '../../wrapper/Size';



export default function ExamDetail(props: IExamDetailProps) {
    const { exam, component, criterias, sizes, open, callback } = props;
    const generateClipTable = () => {
        const column: TableColumnsType<{ Clip: any }> = [
            { title: '考核图样', key: 'clip', dataIndex: 'Clip', width: "80vw" }
        ]
        return column
    }
    /**
 * 项目配分表格
 * @param exam 考核实例
 * @returns 
 */
    const generateScoreTableColumns = (exam: IExam) => {
        const columns = generateSizeTableColumns();
        const c: TableColumnsType<ISize> = [
            ...columns,
            {
                title: '配分',
                key: 'score',
                render: (_: any, size: ISize) => {
                    const sizeId = size.Id;
                    const scoreItem = exam.Data?.scores?.filter(item => item.SizeId === sizeId);
                    if (scoreItem && scoreItem.length > 0) {
                        return scoreItem[0].Score;
                    }
                    return 0
                }
            }
        ];
        return c
    }

    return (
        <div>
            <Modal
                title='考卷详情'
                footer={null}
                open={open}
                onCancel={callback}
                width={"80vw"}
            >
                {component &&
                    <Table
                        dataSource={[{ Clip: <Image alt="考核图样" width="100%" src={`${REACT_APP_BASE_API}${component.ClipPath}`} /> }]}
                        columns={generateClipTable()}
                        pagination={false}
                    />
                }
                <Table
                    rowKey={record => record.Id}
                    dataSource={criterias}
                    columns={generateCriteriaColumns()}
                    pagination={false}
                />
                {exam &&
                    <Table
                        rowKey={record => record.Id}
                        dataSource={sizes}
                        columns={generateScoreTableColumns(exam)}
                        pagination={false}
                    />
                }
            </Modal>
        </div>
    )
}
