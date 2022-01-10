import { Modal } from "antd";
import React from "react";

export interface ModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: any) => void;
  loading: boolean;
}

const RequestModal: React.FC<ModalProps> = (props) => {
  const { visible, onCancel, onSubmit, loading } = props;

  return (
    <Modal
      title="UseRequest Loading 弹窗"
      visible={visible}
      onCancel={onCancel}
      onOk={() => onSubmit("UseRequest Modal")}
      confirmLoading={loading}
    >
      UseRequest Loading 弹窗
    </Modal>
  );
};

export default RequestModal;
