import "./styles.css";
import React, { useRef } from "react";

import { useState, useEffect } from "react";

const CONFIG = {
  threshold: [0, 0.1, 0.9, 1],
  triggerOnce: false,
  rootMargin: "0px"
};

function useIntersectionObserver(
  ref?: React.MutableRefObject<HTMLElement | null>,
  config = CONFIG
) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) {
      console.warn(
        `No target specified - use useRef() hook to pass the target value`
      );
      return;
    }

    const el = ref.current;

    const observer = new globalThis.IntersectionObserver(
      function (entries) {
        if (config.triggerOnce) {
          if (entries[0].isIntersecting) {
            setIntersecting(true);
            if (!!el) {
              observer.unobserve(el);
            }
          }
        } else {
          setIntersecting(
            entries[0].isIntersecting && entries[0].intersectionRatio > 0.9
          );
        }
        console.log(entries[0]);
      },
      {
        ...CONFIG,
        ...config
      }
    );

    if (!!el) {
      observer.observe(el);
    }

    return () => {
      if (!!el) {
        observer.unobserve(el);
      }
    };
  }, [ref, config, setIntersecting]);

  return isIntersecting;
}

const IntersectionObserver = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isIntersecting = useIntersectionObserver(containerRef);
  const containerRef2 = useRef<HTMLDivElement | null>(null);
  const isIntersecting2 = useIntersectionObserver(containerRef2);
  return (
    <div style={{ display: "flex", width: "4500px" }}>
      <div style={{ width: "200px" }}>
        <span>1</span>
        <div ref={containerRef}>
          {isIntersecting ? "Intersected" : "Not Yet"}
        </div>
      </div>
      <div style={{ width: "200px" }}>
        <span>2</span>
        <div ref={containerRef2}>
          {isIntersecting2 ? "Intersected" : "Not Yet"}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>use intersection</h1>
      <div
        style={{
          height: "300px",
          overflow: "auto",
          backgroundColor: "white",
          padding: "2rem",
          color: "black"
        }}
      >
        <IntersectionObserver />
      </div>
    </div>
  );
}
