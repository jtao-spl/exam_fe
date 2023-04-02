import React from 'react';

import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SiderLayout from './Sider';
import SubTitle from './SubTitle';
import { ShowLoginUser } from '../pages/Login';

const { Header, Content } = Layout;

export default function LayoutComponent() {

  return (
    <Layout>
      <Header style={{ backgroundColor: "#0088FF" }}>
        <div style={{ float: "left", fontSize: 18 }}>LOGO&系统名称</div>
        <ShowLoginUser />
      </Header>
      <Layout>
        <SiderLayout />
        <Layout style={{ padding: '0 24px 24px' }}>
          <SubTitle />
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              minHeight: 80,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )

}
