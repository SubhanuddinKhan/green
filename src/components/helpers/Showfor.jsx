import React, { useState, useEffect } from "react";

//display child elemnt if user has authority
export function Showfor(props) {
  const [show, setShow] = useState(false);
  const { showfor, children, ...rest } = props;
  useEffect(() => {
    if (showfor) {
      setShow(true);
    }
  }, [showfor]);
  return <div {...rest}>{show && children}</div>;
}
