import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.variable.min.css';

import ModalComponent from './components/1-modal-loading';
import AspectRadio from './components/0-aspect-radio';
import MultiVideoSoundsControl from './components/2-rxjs-multi-video-sounds-control';
import FormGetFieldValues from './components/3-form-getFieldValue/index';
import RefPass1 from './components/4-parent-child-pass-ref/pass-by-event';
import MergeOperator from './components/4-parent-child-pass-ref/merge-operator-test';

ReactDOM.render(
  <React.StrictMode>
    <RefPass1 />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
