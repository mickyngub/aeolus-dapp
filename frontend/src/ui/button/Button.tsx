import React from "react";
import styled, { keyframes } from "styled-components";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: string;
  size?: string;
  onClick?: () => void;
}

const buttonSize = {
  extraSmall: {
    width: 150,
    height: 50,
  },
  small: {
    width: 180,
    height: 60,
  },
  medium: {
    width: 200,
    height: 70,
  },
  large: {
    width: 300,
    height: 100,
  },
};

const Button = ({ children, size, onClick }: Props) => {
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
      onClick={onClick}
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

const shiny = keyframes`
    
    0%{
        stroke-dashoffset: -480;
    }

    75% {
        stroke-dashoffset: 680;

    }
    100% {
        opacity: 0;
    }
`;

const StyledSVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  fill: none;
  stroke: #fff;
  stroke-dasharray: 150 480;
  stroke-dashoffset: 150;
  transition: 1s ease-in-out;
  animation: ${shiny} 3s infinite;
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
    color: white;
  }

  &:hover ${StyledSVG} {
  }
`;

const StyledSpan = styled.span`
  color: inherit;
  font-size: 1rem;
  font-weight: 400;
`;

export default Button;
