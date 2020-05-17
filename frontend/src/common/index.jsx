import { LoadingOutlined, FileImageTwoTone } from "@ant-design/icons";
import { Upload as AntUpload, Button, Modal } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import Comment from "./comment";

const Wrapper = ({ children, data }) => {
  return data.loading ? (
    <LoadingOutlined />
  ) : data.error ? (
    <Fragment>{data.error}</Fragment>
  ) : (
    <Fragment>{children}</Fragment>
  );
};

const Upload = ({ className, onChange, uploaded }) => {
  const INIT = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
  };
  const [file, setFile] = useState(INIT);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    uploaded && setFileList([]);
  }, [uploaded]);
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleCancel = () => setFile(() => ({ ...INIT }));
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setFile(() => ({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    }));
  };

  const handleChange = ({ fileList }) => {
    onChange(fileList);
    setFileList(fileList);
  };
  return (
    <div className={fileList.length >= 1 ? `${className} disabled` : className}>
      <AntUpload
        //   remember to change this one
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        <Button>
          <FileImageTwoTone />
        </Button>
      </AntUpload>
      <Modal
        visible={file.previewVisible}
        title={file.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={file.previewImage} />
      </Modal>
    </div>
  );
};

export { Wrapper, Upload, Comment };
