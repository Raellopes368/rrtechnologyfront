import React from "react";
import { MdError } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import { Container, Preview } from "./StylePreview";
import "react-circular-progressbar/dist/styles.css";

const FileList = ({ file }) => (
  <Container>
    {!file[0].uploaded && !file[0].error && (
      <div className="progress">
        <CircularProgressbar
          styles={{
            root: { width: 100 },
            path: { stroke: "#00ff7f" }
          }}
          strokeWidth={10}
          value={file[0].progress}
        />
        <p>Aguarde ...</p>
      </div>
    )}
    {!!file[0].error && (
      <div>
        <MdError size={100} color={"#ff0000"} />
        Imagem inválida!
      </div>
    )}
    {!!file[0].uploaded && <Preview key={file[0].id} src={file[0].preview} />}
  </Container>
);

export default FileList;
