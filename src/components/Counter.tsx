import React from "react";
import { useObservable } from "./common";

class CounterStore {
  public num: number = 0;

  double() {
    this.num *= 2;
  }
}

export function CounterView() {
  const counter = useObservable(CounterStore);
  return (
    <div style={{ border: "solid 1px black", padding: "1rem", margin: "1rem" }}>
      <h4>Primitive observing</h4>
      <p>{counter.num}</p>
      <button
        onClick={() => {
          counter.num++;
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          counter.num--;
        }}
      >
        -
      </button>
      <button
        onClick={() => {
          counter.double();
        }}
      >
        double
      </button>
    </div>
  );
}
