import React from "react";
import styled from "styled-components";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: string;
}

const Button = ({ children }: Props) => {
  return (
    <StyledButton>
      <StyledSVG width="180px" height="60px" viewBox="0 0 180 60">
        <polyline points="179,1 179,59 1,59 1,1 179,1" />
        <polyline points="179,1 179,59 1,59 1,1 179,1" />
      </StyledSVG>
      <StyledSpan>{children}</StyledSpan>
    </StyledButton>
  );
};

const StyledSVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  fill: none;
  stroke: #fff;
  stroke-dasharray: 150 480;
  stroke-dashoffset: 150;
  transition: 1s ease-in-out;
`;

const StyledButton = styled.button`
  position: relative;
  width: 180px;
  height: 60px;
  cursor: pointer;
  background: var(--color-secondary);
  border: 1px solid var(--color-black);
  outline: none;
  transition: 1s ease-in-out;

  &:hover {
    transition: 1s ease-in-out;
    background: var(--color-accent);
  }

  &:hover ${StyledSVG} {
    stroke-dashoffset: -480;
  }
`;

const StyledSpan = styled.span`
  color: black;
  font-size: 18px;
  font-weight: 100;
`;

export default Button;
