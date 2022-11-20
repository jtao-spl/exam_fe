import React, { useState } from "react";
import { Button, Form, Input, message, Modal } from 'antd';
import { login } from "../api/login";
import { useNavigate } from "react-router-dom";
import { clear } from "../utils/storage";

function Login() {
    const [showModal, setShowModal] = useState(false);
    const [Id, setId] = useState(0);
    const navigate = useNavigate()
    const onFinish = async (values: any) => {
        const { Id, password } = values;
        const res = await login(Id, password);
        const { code, msg, status } = res.data;
        console.log(`response of login:${JSON.stringify(res.data)}`)
        if (code !== 0) {
            message.error(`${msg}`);
            return
        }
        if(status === 0){
            setShowModal(true);
            setId(Id);
        }
        else{
        navigate('/component');
        }
    };

    return (
        <div>
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
        </div>

    );

}

export default Login;
export function Logout() {
    clear();
    const navigate = useNavigate();
    navigate('/login');
    return (
        <div>
        </div>
    )
}
interface IProps{
    showModal: boolean,
    Id: number
}

function ChangePasswordModal(props:IProps){
    const {showModal, Id} = props;
    const navigate = useNavigate();
    return (
        <Modal
        open={showModal}
        title="您的密码为初始状态，请立即修改"
        closable={false}
        okText='去修改'
        cancelText='暂不修改'
        onOk={()=>navigate('/auth/modify',{state: Id})}
        onCancel={()=>navigate('/stu/exams')}
        >
            123
        </Modal>
    )
}