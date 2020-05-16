import { LoadingOutlined } from "@ant-design/icons";
import React, { Fragment } from "react";

const Wrapper = ({ children, data }) => {
  return data.loading ? (
    <LoadingOutlined />
  ) : data.error ? (
    <Fragment>{data.error}</Fragment>
  ) : (
    <Fragment>{children}</Fragment>
  );
};

export { Wrapper };
