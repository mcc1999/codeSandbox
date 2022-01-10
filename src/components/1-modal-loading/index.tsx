import { useRequest } from "ahooks";
import { Button, Space } from "antd";
import { useState } from "react";
import BasicModal from "./modals/0_send_request_modal";
import RequestModal from "./modals/1_useRequest_loading_modal";
import PromiseModal from "./modals/2_return_promise_modal";

const getAsyncData = async (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(alert(`data for ${params} is LA Has No Snow!`));
    }, 2000);
  });
};
const getData = async (params: any) => {
  return alert('我是一个请求！');
};

export default function App() {
  const [modalVisible, setModalVisible] = useState<
    "basic" | "useRequest" | "promise" | ""
  >("");
  const { run, loading } = useRequest(getData, {
    manual: true,
    // onSuccess: () => setModalVisible("")
  });
  return (
    <>
      <Space direction="vertical" size='large'>
        <div>
          <h2>1. Send Request Modal</h2>
          <Button onClick={() => setModalVisible("basic")} type="primary">
            Send Request Modal
          </Button>
        </div>
        <div>
          <h2>2. UseRequest Loading Modal</h2>
          <Button onClick={() => setModalVisible("useRequest")} type="primary">
            UseRequest Modal
          </Button>
        </div>
        <div>
          <h2>3. Promise Loading Modal</h2>
          <Button onClick={() => setModalVisible("promise")} type="primary">
            Promise Modal
          </Button>
        </div>
      </Space>

      <BasicModal 
        visible={modalVisible === "basic"}
        onCancel={() => setModalVisible("")}
        onSubmit={(p) => {
          getData(p);
          setModalVisible("");
        }}
      />

      <RequestModal
        visible={modalVisible === "useRequest"}
        onCancel={() => setModalVisible("")}
        onSubmit={(p) => {
          run(p).then(() => {
            setModalVisible('')
          });
        }}
        loading={loading}
      />
      <PromiseModal
        visible={modalVisible === "promise"}
        onCancel={() => setModalVisible("")}
        onSubmit={async (p) => {
          await getAsyncData(p)
          setModalVisible("");
        }}
      />
    </>
  );
}
