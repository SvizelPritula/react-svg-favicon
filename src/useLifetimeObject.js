import { useRef } from "react";

/**
 * A hook that creates an object and keeps it constant for the lifetime of the component
 * @template T The type of the stored value
 * @param {() => T} factory A function that returs the object that will be stored. Called only once. 
 * @returns {T} The value returned by the factory function uppon first render
 */
export default function useLifetimeObject(factory) {
  var ref = useRef(null);

  if (ref.current == null) {
    ref.current = factory();
  }

  return ref.current;
}