import { useEffect, useLayoutEffect } from "react";

export type TError = {
  code: number;
  message: string;
};

function isErrorWithMessage(error: unknown): error is TError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as Record<string, unknown>).message === "string" &&
    typeof (error as Record<string, unknown>).code === "number"
  );
}

function toErrorWithMessage(
  maybeError: unknown
): TError | Omit<TError, "code"> {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export { toErrorWithMessage, useIsomorphicLayoutEffect };
