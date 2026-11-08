"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Viti aktual, i llogaritur në klient (në server jep vitin e ndërtimit si fallback). */
export default function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
