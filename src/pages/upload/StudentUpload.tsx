import { Button, Form, Space, Tag, Upload } from 'antd';
import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import StudentPreview from './StudentPreview';
import { saveStudents } from '../../api/student';
import { IStudentUpload } from '../../interfaces/Student';
import { useNavigate, useLocation } from 'react-router-dom';


export default function StudentUpload() {
    const navigate = useNavigate();
    const location = useLocation();
    const [students, setStudents] = useState<IStudentUpload[]>([]);

    const beforeUpload = (file: any) => {
        const info =
            // 数据处理excel=>json
            importsExcel(file).then((res: any) => {
                const arr = res.map((item: any) => {
                    // 利用时间戳+索引，生成唯一的ID，也可以直接使用index
                    const newItem = {
                        // Grade: item['年级'],
                        // Major: item['专业'],
                        Name: String(item['姓名']),
                        StudentId: item['学号']
                    }
                    return newItem;
                });
                setStudents(arr)
                // // 表格数据
                // setData(arr);
                // // 导入数据空，禁用「导入」按钮F
                // setDisable(res.length === 0);
            });
        return false;
    }

    const saveStudentInfo = async () => {
        if (students.length === 0) {
            return;
        }
        await saveStudents(location.state.grade.Id, students);
        setTimeout(() => {
            navigate(-1);
        }, 500);
    }
    if(!location.state) return (<div>未选定年级专业，请从学生列表页点击【导入学生信息】跳转本页面。
        <Button type="primary" onClick={()=>navigate('/admin/student/list')}>go</Button>
    </div>)
    return (<div>
        当前：<Tag>{location.state.grade.Grade}级{location.state.grade.Major}专业</Tag>
        <Form>
            <Form.Item>
                {<Space>请点击<Tag color='green'>上传并预览学生信息</Tag>进行数据预览，确认无误后需点击【确认】进行保存。</Space>}
            </Form.Item>
            <Form.Item>
                {<Upload
                    name="importExcel"
                    //application/vnd.ms-excel 代表.xls；application/vnd.openxmlformats-officedocument.spreadsheetml.sheet代表.xlsx格式的excel文件
                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    beforeUpload={beforeUpload}//代表不上传
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>上传并预览学生信息</Button>
                </Upload>
                }
            </Form.Item>
        </Form>
        <div>数据预览</div>
        <Button type='primary' onClick={saveStudentInfo}>确认</Button>
        <div>
            {students ? <StudentPreview
                studentInfoList={students}
                onDelete={(id: number) => {
                    const newStudents = students.filter((item: IStudentUpload) => item.StudentId !== id);
                    setStudents(newStudents)
                }} /> : "待上传"}
        </div>
    </div>)
}


// Excel 数据转为 json 数据
export function importsExcel(file: any) {
    //使用promise导入
    return new Promise((resolve, reject) => {
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();
        //异步操作  excel文件加载完成以后触发
        fileReader.onload = (event) => {
            try {
                const { result } = event.target as any;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = XLSX.read(result, { type: "binary" });
                // 存储获取到的数据
                let data: any = [];
                // 遍历每张工作表进行读取
                for (const sheet in workbook.Sheets) {
                    if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
                        data = data.concat(
                            // 将工作表转换为json数据
                            XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                        );
                    }
                }
                // 如果Excel文件里只有一张数据工作表（比如：data），也可以不遍历，直接获取数据
                // if (Object.prototype.hasOwnProperty.call(workbook.Sheets, "data")) {
                //    // 将工作表转换为json数据            
                //    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                //  }
                resolve(data); //导出数据
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                reject("导入失败");
            }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file);
    });
}