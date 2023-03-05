import { Button, Divider, Form, Input, InputNumber, message, Modal, Select, Space, Table, TableColumnsType, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toggleStatus, createGrade, getGrades, deleteGrade, batchToggleStatus, getGradeById, batchUpdateClass } from '../../api/admin';
import { batchGetStudentInfo } from '../../api/student';
import { IAddGradeProps, IGrade, IGradeTableProps, IStudentInfo, IStudentQueryReq, IStudentTableProps } from '../../interfaces/Student'
import { range } from '../../utils/common';
import EditStudent from './EditStudent';

export default function StudentList() {
  const [students, setStudents] = useState<IStudentInfo[]>([]);
  const [student, setStudent] = useState<IStudentInfo>();
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [grade, setGrade] = useState<IGrade>();
  const [gradeId, setGradeId] = useState(0);
  const queryStudents = async (req: IStudentQueryReq) => {
    const resp = await batchGetStudentInfo(req);
    if (resp) {
      setStudents(resp);
    }
  }
  const queryGrades = async () => {
    const res = await getGrades();
    setGrades(res);
    setGradeId(res[0].Id);
    queryStudents({ GradeId: res[0].Id });
  }
  const onSelectGrade = async () => {
    queryStudents({ GradeId: gradeId });
    const grade = await getGradeById(gradeId);
    if (grade) {
      setGrade(grade);
    }
  }

  useEffect(() => {
    queryGrades();
  }, [])

  //监听选中grade
  useEffect(() => {
    onSelectGrade()
  }, [gradeId]);
  return (
    <div>
      <Button type="primary" onClick={() => setShowAddGradeModal(true)}>新增年级专业</Button>
      <AddGrade
        visible={showAddGradeModal}
        callback={() => {
          setShowAddGradeModal(false);
          getGrades();
        }}
      />
      <GradeTable
        grades={grades}
        defaultGradeKey={gradeId}
        delCallback={queryGrades}
        selectRowCallback={(id: number) => setGradeId(id)}
      />
      <Divider />
      <StudentTable
        students={students}
        grade={grade}
        callback={(req) => queryStudents(req)}
        showEditModal={(student: IStudentInfo) => {
          setStudent(student);
          setShowEditStudentModal(true);
        }}
      />
      <EditStudent
        student={student}
        visible={showEditStudentModal}
        callback={() => { setShowEditStudentModal(false); queryStudents({}) }}
      />
    </div>
  )
}


export function StudentTable(props: IStudentTableProps) {
  const { students, grade, callback, showEditModal } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [loading, setLoading] = useState(false);
  const action = async (record: IStudentInfo) => {
    const res = await toggleStatus(record.StudentId, 3);
    if (res) callback({ Grade: record.Grade, Major: record.Major });
  }

  const generateStudentTableColumn = () => {
    const coloums: TableColumnsType<IStudentInfo> = [
      { title: '学号', key: 'StudentId', dataIndex: 'StudentId' },
      { title: '姓名', key: 'Name', dataIndex: 'Name' },
      { title: '年级', key: 'Grade', dataIndex: 'Grade' },
      { title: '专业', key: 'Major', dataIndex: 'Major' },
      {
        title: '班级', key: 'Class', render: (_: any, record: IStudentInfo) => {
          return (<div>{record.Class === 0 ? '待定' : record.Class + '班'} </div>)
        }
      },
      {
        title: '状态', key: 'status', render: (_: any, record: IStudentInfo) => {
          return (<Tag color={record.Deleted ? 'red' : 'green'}>{record.Deleted ? '已禁用' : '有效'}</Tag>)
        }
      },
      {
        title: '操作', key: 'operation', render: (_: any, record: IStudentInfo) => {
          return (<Space direction='vertical'>
            <Button type='primary' disabled={!record.Deleted} onClick={() => action(record)}>启用</Button>
            <Button type='primary' disabled={record.Deleted} danger onClick={() => action(record)}>禁用</Button>
            <Button type="primary" onClick={() => {
              showEditModal(record);
            }}>修改</Button>
          </Space>)
        }
      }
    ]
    return coloums;
  }

  const disableAccount = async (disable: boolean) => {
    setLoading(true);
    const res = await batchToggleStatus(selectedRowKeys as number[], 3, disable);
    setLoading(false);
    message.info(`执行成功，即将刷新页面.`)
    setSelectedRowKeys([]);
    if (res) {
      setTimeout(() => {
        window.location.reload() // 强制页面刷新
      }, 500);
    }

  }

  const setClass = async () => {
    if (!selectedClass) {
      message.error(`请先指定班级`);
      return;
    }
    setLoading(true);
    const res = await batchUpdateClass(selectedRowKeys as number[], selectedClass);
    setLoading(false);
    message.info(`执行成功，即将刷新页面.`)
    setSelectedRowKeys([]);
    setSelectedClass(0);
    if (res) {
      setTimeout(() => {
        window.location.reload() // 强制页面刷新
      }, 500);
    }
  }

  const hasSelected = selectedRowKeys.length > 0;
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div>
      <Space direction='vertical'>
        <Space style={{ margin: 10 }}>
          <Button type="primary" onClick={() => disableAccount(true)} disabled={!hasSelected} loading={loading}>
            批量禁用
          </Button>
          <Button type="primary" onClick={() => disableAccount(false)} disabled={!hasSelected} loading={loading}>
            批量启用
          </Button>
        </Space>
        <Space direction='horizontal'>
          <div>分配至</div>
          {grade ? <Select style={{ width: "100px" }}
            onChange={(values: any) => {  setSelectedClass(values); }}
            options={range(grade.ClassCount).map((item: number) => ({ value: item + 1, label: `${item + 1}班` }))} /> : ''
          }
          <Button type='primary' onClick={() => setClass()} disabled={!hasSelected} loading={loading} >确定</Button>
        </Space>
        <div>
          <span style={{ margin: 10 }}>
            {hasSelected ? `已选定 ${selectedRowKeys.length} 名学生` : ''}
          </span>
        </div>
      </Space>
      <Table
        rowSelection={rowSelection}
        bordered={true}
        rowKey={record => record.StudentId} //此处设置每个行的key为学号，勾选时key就是学号
        columns={generateStudentTableColumn()}
        dataSource={students}
        pagination={false}
        scroll={{ y: 400 }}
      />
    </div>)
}


function AddGrade(props: IAddGradeProps) {
  const { visible, callback } = props;

  const saveGrade = async (values: any) => {
    const { Grade, Major, ClassCount } = values;
    const res = await createGrade(Number.parseInt(Grade), Major, ClassCount);
    if (res) callback();
  }

  return (<div>
    <Modal
      title='新增年级专业'
      open={visible}
      footer={null}
      onCancel={callback}
    >
      <Form
        onFinish={saveGrade}
      >
        <Form.Item
          label='年级'
          name="Grade"
          rules={[{
            required: true,
            message: '请输入'
          }]}
        >
          <InputNumber min={2000} />
        </Form.Item>
        <Form.Item
          label='专业'
          name="Major"
          rules={[{
            required: true,
            message: '请输入'
          }]}
        >
          <Input max={20} />
        </Form.Item>
        <Form.Item
          label='班级数量'
          name="ClassCount"
          rules={[{
            required: true,
            message: '请设置该年级专业共多少个班'
          }]}
        >
          <InputNumber min={1} placeholder="请预设置该年级专业最多有多少班级" style={{ width: 300 }} />
        </Form.Item>
        <Space>
          <Button type='primary' htmlType='reset'>清除</Button>
          <Button type='primary' htmlType='submit'>保存</Button>
        </Space>
      </Form>
    </Modal>
  </div >)
}

function GradeTable(props: IGradeTableProps) {
  const { grades, defaultGradeKey, delCallback, selectRowCallback } = props;
  const navigate = useNavigate();
  const delGrade = async (grade: IGrade) => {
    const res = await deleteGrade(grade.Id);
    if (res) delCallback();
  }

  const generateGradeTableColumns = () => {
    const columns: TableColumnsType<IGrade> = [
      { title: '年级', key: 'grade', dataIndex: 'Grade' },
      { title: '专业', key: 'Major', dataIndex: 'Major' },
      {
        title: '操作', key: 'op', render: (_: any, record: IGrade) => {
          return (<Space>
            <Button type="primary" onClick={() => navigate('/admin/student/upload', { state: { grade: record } })}>导入学生账户</Button>
            {/* <Button type="default" onClick={() => navigate('/admin/student/class/manage', { state: { grade: record } })} >分班</Button> */}
            <Button type='primary' danger onClick={() => delGrade(record)} >删除</Button>
          </Space >)
        }
      }
    ];
    return columns;
  }

  return (<div>
    <Table
      rowSelection={{
        type: 'radio',
        onChange: (selectedRowKeys: React.Key[], selectedRows: IGrade[]) => {
          selectRowCallback(selectedRowKeys[0] as number);
        },
        defaultSelectedRowKeys: [defaultGradeKey]
      }}
      rowKey={record => record.Id}
      columns={generateGradeTableColumns()}
      dataSource={grades}
      pagination={false}
      scroll={{ y: 400 }}
    />
  </div>)
}
