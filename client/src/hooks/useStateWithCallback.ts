import {useCallback, useEffect, useRef, useState} from "react";

const useStateWithCallback = (initialState: any) => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef<any>();

  const updateState = useCallback((newState: any, callback: () => any) => {
    callbackRef.current = callback;

    setState((prev: any) => (typeof newState === 'function' ? newState(prev) : newState))
  }, [])

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state)
      callbackRef.current = null
    }
  }, [state]);

  return [state, updateState]
}

export default useStateWithCallback;