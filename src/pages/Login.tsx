import React, { useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Space, Tag } from 'antd';
import { login } from "../api/login";
import { useNavigate } from "react-router-dom";
import { clear, get } from "../utils/storage";

function Login() {
    const [showModal, setShowModal] = useState(false);
    const [Id, setId] = useState(0);
    const navigate = useNavigate()
    const onFinish = async (values: any) => {
        const { Id, password } = values;
        const res = await login(Id, password);
        const { code, msg, status, role } = res.data;
        console.log(`response of login:${JSON.stringify(res.data)}`)
        if (code !== 0) {
            message.error(`${msg}`);
            return
        }
        if (status === 0) { //未修改过密码
            setShowModal(true);
            setId(Id);
        }
        else {
            if (role === 1) {
                navigate('/admin/teacher/list');
            }
            if (role === 2) {
                navigate('/teacher/component/list');
            }
            if (role === 3) {
                navigate('/student/exams')
            }
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4} >
                <Form name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Id"
                        name="Id"
                        rules={[{ required: true, message: 'Please input your Id!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <ChangePasswordModal
                    showModal={showModal}
                    Id={Id}
                />
            </Col>
        </Row>

    );

}

export default Login;
interface IProps {
    showModal: boolean,
    Id: number
}

function ChangePasswordModal(props: IProps) {
    const { showModal, Id } = props;
    const navigate = useNavigate();
    return (
        <Modal
            open={showModal}
            title="初次登录，请修改密码。"
            closable={false}
            okText='去修改'
            cancelText='暂不修改'
            onOk={() => navigate('/auth/modify', { state: Id })}
            onCancel={() => {
                const role = get('role');
                console.log(`role: ${role}`)
                if (role === '2') {
                    navigate('/teacher/component/list')
                } else if (role === '1') {
                    navigate('/admin/teacher/list')
                } else {
                    navigate('/student/exams')
                }
            }}
        />
    )
}


export const ShowLoginUser = () => {
    const navigate = useNavigate();
    if (get('Id')) {
        return (<Space style={{ float: "right" }}>
            <Tag>你好，{get('Id')}</Tag>
            <Button onClick={() => {
                clear();
                navigate('/login');
            }} type="primary" danger>退出</Button>
        </Space>)
    }
    else {
        return (<Space style={{ float: "right" }}>
            <Tag onClick={() => navigate('/login')}>请登录</Tag>
        </Space>)
    }
}