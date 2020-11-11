import React, { Suspense } from "react";
import { ErrorBoundary, fromPromise, useObservable } from "./common";

function liveOrDie() {
  return Math.round(Math.random());
}

function dalayedErrroPromise(error: string, delayMs: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(error);
    }, delayMs);
  });
}

function fetchRedditThreads() {
  if (liveOrDie()) {
    return dalayedErrroPromise("What's going on? this is user error!", 1000);
  }

  return fetch("http://www.reddit.com/new.json?limit=2").then((r) => r.json());
}

class RedditStore {
  threads = fromPromise(fetchRedditThreads());

  refresh() {
    this.threads = fromPromise(fetchRedditThreads());
  }
}

function RedditThreads({ reddit }: { reddit: RedditStore }) {
  return (
    <p
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {JSON.stringify(reddit.threads.read())}
    </p>
  );
}

export function LazyRedditThreads() {
  const redditStore = useObservable(RedditStore);

  return (
    <div style={{ border: "solid 1px black", padding: "1rem", margin: "1rem" }}>
      <h4>Promise observing</h4>
      <button onClick={() => redditStore.refresh()}>refresh</button>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <RedditThreads reddit={redditStore} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
