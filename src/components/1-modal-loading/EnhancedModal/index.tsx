import React, { useEffect, useState } from 'react';
import type { ModalProps } from 'antd';
import { Modal } from 'antd';

export interface EnhancedModalProps extends Omit<ModalProps, 'onOk'> {
  onOk?: () => Promise<unknown> | void;
}

// 支持自动处理 loading 状态的 Modal 组件
// TODO: 自定义 footer
const EnhancedModal: React.FC<EnhancedModalProps> = (props) => {
  const {
    visible,
    maskClosable = false,
    keyboard = false,
    confirmLoading,
    onOk,
    ...restProps
  } = props;
  const [loading, setLoading] = useState<boolean | undefined>(false);

  useEffect(() => {
    setLoading(confirmLoading);
  }, [confirmLoading]);

  useEffect(() => {
    if (!visible && !confirmLoading && loading) {
      setLoading(false);
    }
  }, [visible, confirmLoading, loading]);

  async function handleOk() {
    const ret = onOk?.();
    if (ret && ret.then) {
      setLoading(true);
      try {
        await ret;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      maskClosable={maskClosable}
      keyboard={keyboard}
      confirmLoading={loading}
      {...restProps}
      onOk={handleOk}
    />
  );
};

export default Object.assign(EnhancedModal, Modal);
