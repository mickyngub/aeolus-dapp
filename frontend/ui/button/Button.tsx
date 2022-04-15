import React from "react";
import styled from "styled-components";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: string;
  size?: string;
}

const buttonSize = {
  small: {
    width: 180,
    height: 60,
  },
  medium: {
    width: 240,
    height: 80,
  },
  large: {
    width: 300,
    height: 100,
  },
};

const Button = ({ children, size }: Props) => {
  let sizeButton;
  if (size) {
    sizeButton = buttonSize[size as keyof typeof buttonSize];
  }
  return (
    <StyledButton
      style={{
        "--button-width": sizeButton?.width + "px",
        "--button-height": sizeButton?.height + "px",
      }}
    >
      <StyledSVG
        width={`${sizeButton?.width}`}
        height={`${sizeButton?.height}`}
        viewBox="0 0 180 60"
      >
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

const StyledButton = styled.button<{
  style: { "--button-width": string; "--button-height": string };
}>`
  position: relative;
  width: var(--button-width);
  height: var(--button-height);
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
  font-size: 1.25rem;
  font-weight: 400;
`;

export default Button;
