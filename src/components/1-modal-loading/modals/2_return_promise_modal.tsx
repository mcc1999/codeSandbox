import { Modal } from "antd";
import React, { useState } from "react";

export interface ModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: any) => Promise<unknown>;
}

const PromiseModal: React.FC<ModalProps> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    return onSubmit("Promise Modal").then(() => setLoading(false));
  };
  return (
    <Modal
      title="promise-modal"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      I am promise modal!
    </Modal>
  );
};

export default PromiseModal;
