import styled, { keyframes } from "styled-components";
import "twin.macro";

const Loading = () => {
  return (
    <div tw="relative">
      <p tw="font-bold">AEOLUS</p>
      <StyledSVG width="200" height="200" viewBox="0 0 100 100">
        <PolylineFirst
          points="0,0 100,0 100,100"
          strokeWidth="5"
          fill="none"
        ></PolylineFirst>
        <PolylineFirst
          points="0,0 0,100 100,100"
          strokeWidth="5"
          fill="none"
        ></PolylineFirst>
        <PolylineSecond
          points="0,0 100,0 100,100"
          strokeWidth="5"
          fill="none"
        ></PolylineSecond>
        <PolylineSecond
          points="0,0 0,100 100,100"
          strokeWidth="5"
          fill="none"
        ></PolylineSecond>
      </StyledSVG>
    </div>
  );
};

const strokeSpacing = keyframes`0% {
    stroke-dasharray: 0 200; 
  }
  45% {
    stroke-dashoffset: 0;
    stroke-dasharray: 200 200;
  }
  90% {
    stroke-dashoffset: -200;
    stroke-dasharray: 200 200;
  }
  100% {
    stroke-dashoffset: -200;
    stroke-dasharray: 200 200;
  }`;

const strokeColor = keyframes` 
    0%  { stroke: var(--color-primary); }
    24% { stroke: var(--color-primary-dark); }
    25% { stroke: var(--color-secondary); }
    49% { stroke: var(--color-accent); }
    50% { stroke: var(--color-black); }
    74% { stroke: var(--color-white); }
    75% { stroke: var(--color-primary);; }
    99% { stroke: var(--color-primary);; }
`;

const StyledSVG = styled.svg`
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(1);
  transform: translate(-50%, -50%) rotate(45deg) scale(1);
`;

const PolylineFirst = styled.polyline`
  stroke: #232323;
`;

const PolylineSecond = styled.polyline`
  -webkit-animation: ${strokeSpacing} 1.2s ease-in, ${strokeColor} 4.8s linear;
  animation: ${strokeSpacing} 1.2s ease-in, ${strokeColor} 4.8s linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-delay: 0;
  animation-delay: 0;
  -webkit-animation-direction: normal;
  animation-direction: normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-play-state: running;
  animation-play-state: running;
  -webkit-transform-origin: center center;
  transform-origin: center center;
`;

export default Loading;
