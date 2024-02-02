import {useCallback, useEffect, useRef, useState} from "react";

// todo add types and refactor

const useStateWithCallback = (initalState) => {
  const [state, setState] = useState(initalState);
  const callbackRef = useRef();

  const updateState = useCallback((newState, callback) => {
    callbackRef.current = callback;

    setState(prev => typeof newState === 'function' ? newState(prev) : newState)
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