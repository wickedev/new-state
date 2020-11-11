import React from "react";
import { useObservable } from "./common";

interface IUser {
  name: string;
}

class NestedStore {
  public user: IUser = {
    name: "Ryan Yang",
  };
}

export function UserView() {
  const nested = useObservable(NestedStore);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    nested.user.name = e.target.value;
  };

  return (
    <div style={{ border: "solid 1px black", padding: "1rem", margin: "1rem" }}>
      <h4>Nested observing</h4>
      <p>{nested.user.name}</p>
      <input onChange={handleChangeName} defaultValue={nested.user.name} />
    </div>
  );
}
