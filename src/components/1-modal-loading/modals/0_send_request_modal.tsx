import { Modal } from "antd";
import React from "react";

export interface ModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: any) => Promise<unknown> | void;
}

const BasicModal: React.FC<ModalProps> = (props) => {
  const { visible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="可以发请求的弹窗"
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      可以发请求的弹窗
    </Modal>
  );
};

export default BasicModal;
