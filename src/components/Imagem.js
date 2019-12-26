import styled from "styled-components";

export const ImagemContt = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: row;
  background: #cecece;
  cursor: pointer;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  border-radius: 50%;
  background-size: cover;
  background-position: 50% 50%;
`;
