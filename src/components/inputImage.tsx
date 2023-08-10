import React, { FC } from "react";

type InputFileProps = React.ComponentProps<"input">;

const InputImage: FC<InputFileProps> = (props) => {
  return (
    <input type="file" accept="image/png, image/jpeg, text/css" {...props} />
  );
};

export default InputImage;
