import React from 'react';

import { Image, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SiderLayout from './Sider';
import SubTitle from './SubTitle';
import { ShowLoginUser } from '../pages/Login';
import { REACT_APP_BASE_API } from '../config/default';

const { Header, Content } = Layout;

export default function LayoutComponent() {

  return (
    <Layout>
      <Header style={{ backgroundColor: "rgba(0, 84, 138, 0.77)" }}>
        <div style={{ float: "left", fontSize: 18 }}>
          <Image alt="零件图样" preview={false} src={`${REACT_APP_BASE_API}/images/logo5.png`} />
        </div>
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
