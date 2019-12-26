import styled from "styled-components";

export const Container = styled.div`
  width: 125px;
  height: 150px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff0000;
  text-align: center;
`;

export const progress = styled.div`
  width: 125px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
//background-image: url(${props => props.src});
export const Preview = styled.div`
  width: 123px;
  height: 148px;
  border-radius: 5px;
  cursor: pointer;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: row;
`;
