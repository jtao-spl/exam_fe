import React, { FC } from 'react';
// import './App.less';
import View from './components/View';

const App: FC = () => {
  const myStyle = {
    backgroundImage: "url(/bg.jpg)",
    height: '20vh',
    // marginTop: '-70px',
    // fontSize: '50px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };
  return (<div style={myStyle}>
    <View />
  </div>)
}

export default App;
