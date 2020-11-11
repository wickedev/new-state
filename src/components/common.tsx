import React, { ReactNode, useContext, useState } from "react";
import LRU from "lru-cache";

const LRUCacheContext = React.createContext(new LRU());

enum Status {
  PENDING,
  FULLFILED,
  REJECTED,
}

export function fromPromise<T>(promise: Promise<T>) {
  let status: Status = Status.PENDING;
  let result: T;
  let suspender = promise.then(
    (r) => {
      status = Status.FULLFILED;
      result = r;
    },
    (e) => {
      status = Status.REJECTED;
      result = e;
    }
  );
  return {
    read() {
      switch (status) {
        case Status.PENDING:
          throw suspender;
        case Status.REJECTED:
          throw result;
        case Status.FULLFILED:
          return result;
      }
    },
  };
}

interface Constructor<T> {
  new (): T;
  name: string;
}

function useStoreFactory<S>(constructor: Constructor<S>, key?: string): any {
  const lruCache = useContext(LRUCacheContext);
  const uniqueKey = key ? `${constructor.name}-${key}` : constructor.name;

  const cached = lruCache.get(uniqueKey);

  if (cached) {
    return cached;
  }

  const created = new constructor();
  lruCache.set(uniqueKey, created);
  return created;
}

const validator = {
  // @ts-ignore
  get(target: any, key: PropertyKey) {
    if (typeof target[key] === "object" && target[key] !== null) {
      return new Proxy(target[key], validator);
    } else {
      return target[key];
    }
  },
  set(target: any, key: PropertyKey, value: any) {
    return true;
  },
};

function createProxy(
  target: any,
  ctag: number,
  setCtag: (ctag: number) => void
): any {
  const proxy = new Proxy(target, {
    set(target: any, key: PropertyKey, value: any): boolean {
      target[key] = value;
      setCtag(ctag + 1);
      return true;
    },
    get(target: any, key: PropertyKey): any {
      if (typeof target[key] === "function" && target[key] !== null) {
        const method = target[key];
        method.bind(target);
        return method;
      } else if (typeof target[key] === "object" && target[key] !== null) {
        return createProxy(target[key], ctag, setCtag);
      } else {
        return target[key];
      }
    },
  });

  return proxy;
}

export function useObservable<S>(constructor: Constructor<S>, key?: string): S {
  const [ctag, setCtag] = useState(0);
  const store = useStoreFactory(constructor, key);

  return createProxy(store, ctag, setCtag);
}

export class ErrorBoundary extends React.Component<{}, { error?: Error }> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(
    previousProps: { children: ReactNode },
    previousState: { error?: Error }
  ) {
    if (previousProps.children !== this.props.children) {
      this.setState({ error: undefined });
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const error = this.state.error;
    if (error) {
      return <p style={{ color: "#c7384b" }}>{error}</p>;
    }

    return this.props.children;
  }
}
