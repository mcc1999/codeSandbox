import ProForm from '@ant-design/pro-form';
import { useScroll, useThrottleFn } from 'ahooks';
import type { FormInstance } from 'antd';
import { Button, Card, Checkbox, Col, Empty, Form, Input, Modal, Row, Space } from 'antd';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './index.less';

interface ModalProps {
  visible: boolean;
  cardData: any[];
  initialValues?: any[];
  onSearch: (params: { searchParams?: string }) => void;
  onSubmit: (checkedData: any[]) => void;
  onCancel: () => void;
  onScrollEnd: () => void;
}
const useMyThrottleFn = (fn: (...args: any[]) => any) => {
  const { run } = useThrottleFn(fn, { wait: 2000 });
  return run;
};
const CardModal: React.FC<ModalProps> = (props) => {
  const { onSearch, onSubmit, onCancel, onScrollEnd, cardData, visible, initialValues } = props;
  const [checkedCnt, setCheckedCnt] = useState<number>(0);
  const [checkedList, setCheckedList] = useState<any[]>(initialValues || []);

  const formRef = useRef<FormInstance<{ mediaName: string }>>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const position = useScroll(scrollRef);
  const throttleOnScrollEnd = useMyThrottleFn(onScrollEnd);
  const throttleOnSearch = useMyThrottleFn(onSearch);

  useLayoutEffect(() => {
    if (
      visible &&
      scrollRef.current?.scrollHeight &&
      position.top !== 0 &&
      scrollRef.current?.scrollHeight - position.top === scrollRef.current?.getBoundingClientRect().height
    ) {
      throttleOnScrollEnd();
    }
  }, [visible, position.top]);

  const handleCancel = () => {
    scrollRef.current!.scrollTop = 0;
    return onCancel();
  };

  const handleSubmit = () => {
    scrollRef.current!.scrollTop = 0;
    return onSubmit(checkedList || []);
  };

  const handleSearch = async () => {
    const fieldValues = await formRef.current!.validateFields();
    throttleOnSearch(fieldValues);
  };

  const searchBar = (
    <Row justify="space-between" className="searchBar">
      <Col>
        <ProForm<{ mediaName: string }> layout="inline" submitter={false} formRef={formRef}>
          <Form.Item name="mediaName">
            <Input placeholder="请输入视频名称" maxLength={32} />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleSearch}>重置</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        </ProForm>
      </Col>
      <Col>
        <span className="selectCnt">{`已选(${checkedCnt})`}</span>
      </Col>
    </Row>
  );

  const cards = cardData ? (
    cardData.map((media) => (
      <Col>
        <Card>
          <div className="wrapper">
            <Space align="start">
              <div className="cover">
              </div>
              <div className="info">
              </div>
              <div className="checkbox">
                <Checkbox
                  value={media.mediaId}
                  disabled={!checkedList.includes(media.mediaId) && checkedCnt >= 100}
                ></Checkbox>
              </div>
            </Space>
          </div>
        </Card>
      </Col>
    ))
  ) : (
    <Empty />
  );

  return (
    <Modal
      title='卡片选择弹窗'
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      forceRender
      maskClosable={false}
      className="mediaOriginsModal"
      destroyOnClose
      afterClose={() => {
        setCheckedList([]);
        setCheckedCnt(0);
      }}
    >
      {searchBar}
      <div ref={scrollRef} className="scrollBox">
        <Checkbox.Group
          defaultValue={initialValues?.map((r) => r.mediaId)}
          onChange={(values) => {
            console.log(values);
            setCheckedCnt(values.length);
            setCheckedList(values as number[]);
          }}
        >
          <Row gutter={[16, 14]}>{cards}</Row>
        </Checkbox.Group>
      </div>
    </Modal>
  );
};

export default CardModal;
