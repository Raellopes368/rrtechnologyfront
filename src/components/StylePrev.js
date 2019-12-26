import styled from "styled-components";

export const StylePrev = styled.div`
  margin-top: 40px;
  width: 70%;
  height: 62%;
  cursor: pointer;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  border-radius: 5px;
  background-size: cover;
  background-position: 50% 50%;
  z-index:1;
`; 