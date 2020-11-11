import React from "react";
import { CounterView } from "./Counter";
import { UserView } from "./Nested";
import { LazyRedditThreads } from "./Reddit";

export function App() {
  return (
    <div>
      <CounterView />
      <UserView />
      <LazyRedditThreads />
    </div>
  );
}
