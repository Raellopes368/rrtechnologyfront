import styled from "styled-components";

export const Imagem = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: row;
  background: #cecece;
  cursor: pointer;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  border-radius: 50%;
  background-size: cover;
  background-position: 50% 50%;
  margin-top: 5px;
`;
