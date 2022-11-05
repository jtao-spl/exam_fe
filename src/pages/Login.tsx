import React, { Component } from "react";
import { Button, Checkbox, Form, FormInstance, Input } from 'antd';
import { login } from "../api/login";

class Login extends Component {
    state = { name: "", password: "" }
    onFinish = async (values: any) => {
        const { name, password } = values;
        console.log(`values: ${JSON.stringify(values)}, typeof values:${typeof values}, name: ${name} password: ${password}`);
        const res = await login(name, password);
        if (res.status == 200) {
            console.log('login success');
            return
        }
        console.log('login fail');
        alert('账号密码校验未通过，请重新登录。')
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    // const saveData:(event:React.ChangeEventHandler<HTMLInputElement>) = (type:string)=>{
    //     return (event:React.ChangeEventHandler<HTMLInputElement>)=>this.setState({[type]:event.target.value})
    // }
    render(): React.ReactNode {
        return (
            <div>
                <Form name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="name"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
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
            </div>

        );
    }
}

export default Login;