
// import { Button, Form, InputNumber, message, Modal, Table, TableColumnsType } from 'antd';
// import React, { useEffect } from 'react'
// import { getExamById, saveExamScores } from '../../api/exam';

// import { ISizeScore, IStandardProps, sizeScopeToDelta } from '../../interfaces/Exam';
// import { ISize } from '../../interfaces/Size';
// import { getSizesByComponentId } from '../../wrapper/Component';
// import { getCalculatedSizeForExam } from '../../wrapper/Exam';
// import { generateSizeTableColumns } from '../../wrapper/Size';



// export default function Standard(props: IStandardProps) {
//     const { visible, ExamId, cancel } = props;
//     const [form] = Form.useForm();
//     const onFinish = async (values: any) => {
//         const Sizes: { Score: number }[] = values.Sizes;
//         const table: ISize[] = values.table;
//         const total = Sizes.reduce((a, b) => ({ Score: a.Score + b.Score }));
//         if (total.Score !== 100) {
//             message.error(`分数总和不为100. 当前总和为:${total.Score}.请修改.`);
//             return
//         }
//         let SizeScore: ISizeScore[] = [];
//         table.map((size, index: number) => {
//             SizeScore.push({ SizeId: size.Id, Score: Sizes[index].Score });
//         })
//         const res = await saveExamScores(SizeScore, ExamId);
//        if(!res) return;
//         cancel()

//     }
//     const getSizes = async (ExamId: number) => {
//         console.log(`getSizes CALLED`)
//         if (ExamId === 0) {
//             return;
//         }
//         const exam = await getExamById(ExamId);

//         if(!exam) return;
//         const sizes = await getSizesByComponentId(exam.ExamComponent);
        
//         const newSizes = getCalculatedSizeForExam(exam, sizes, sizeScopeToDelta);
//         form.resetFields(["table"]);
//         form.setFieldsValue({
//             table: newSizes
//         });
//     }

//     const generateStandardColumns = () => {
//         const fullColumns = generateSizeTableColumns();
//         const columns: TableColumnsType<ISize> = [
//             ...fullColumns,
//             {
//                 title: '配分',
//                 key: 'standard',
//                 render: (_: any, size: ISize, index) => {
//                     return (
//                         <Form.Item name={['Sizes', index, "Score"]}
//                             required={true}
//                             rules={[{
//                                 required: true,
//                                 message: '请设置分数'
//                             }]}>
//                             <InputNumber min={0} max={100} step={1} />
//                         </Form.Item>
//                     )
//                 },
//             }
//         ]
//         return columns;
//     }
//     useEffect(() => {
//         getSizes(ExamId);
//     }, [ExamId])

//     return (
//         <div>
//             <Modal
//                 title="设置零件配分"
//                 open={visible}
//                 footer={null}
//                 width={"80vw"}
//                 onCancel={() => cancel()}>

//                 <Form form={form} onFinish={onFinish}>
//                     <Form.Item name="table"
//                         valuePropName='dataSource'
//                     >
//                         <Table bordered columns={generateStandardColumns()} pagination={false} scroll={{ x: "100%" }} />
//                     </Form.Item>
//                     <Form.Item>
//                         <Button htmlType="submit" type="primary">
//                             Submit
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Modal>

//         </div>
//     )
// }
import React from 'react'

export default function Standard() {
  return (
    <div>Standard</div>
  )
}


