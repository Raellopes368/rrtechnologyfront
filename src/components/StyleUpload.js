import styled, { css } from "styled-components";

const dragActive = css`
  border-color: #78e5d5;
`;

const dragReject = css`
  border-color: #e57878;
`;

export const DropContainer = styled.div.attrs({
  className: "dropzone"
})`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  width: 125px;
  height: 150px;
  transition: height 0.2s ease;
  ${props => props.isDragActive && dragActive};
  ${props => props.isDragReject && dragReject};
`;

const messageColors = {
  default: "#999",
  error: "#e57878",
  success: "#78e5d5"
};

export const UploadMessage = styled.p`
  color: ${props => messageColors[props.type || "default"]};
  padding: 0 0 0 7px;
`;
