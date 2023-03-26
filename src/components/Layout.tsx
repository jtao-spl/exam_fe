import React, { Component } from 'react';

import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import SiderLayout from './Sider';
import SubTitle from './SubTitle';
import { ShowLoginUser } from '../pages/Login';

const { Header, Content } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map(key => ({
  key,
  label: `nav ${key}`,
}));


export default function LayoutComponent() {

  return (
    <Layout>
      <Header>
        <ShowLoginUser />
      </Header>
      <Layout>
        <SiderLayout />
        <Layout style={{ padding: '0 24px 24px' }}>
          <SubTitle />
          <Content
            className="site-layout-background"
            style={{
              // padding: 24,
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
