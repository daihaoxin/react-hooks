import { useEffect, useState, useReducer } from "react";
import axios from "axios";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false
      };
    case "FETCH_FAIL":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
const useDataApi = (initUrl, initData) => {
  const [url, setUrl] = useState(initUrl);
  const initState = {
    data: initData,
    isLoading: false,
    isError: false
  };
  const [state, dispatch] = useReducer(dataFetchReducer, initState);
  useEffect(() => {
    // 用来标识组件是否已经被卸载
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        // 组件被卸载，就不要执行状态更新了，继续更新已经没有意义
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (e) {
        dispatch({ type: "FETCH_FAIL" });
      } finally {
        // setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      // 当组件被卸载的时候，设置 didCancel 为true
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

const useHackerNewsApi = (initUrl, initData) => {
  const [data, setData] = useState(initData);
  const [url, setUrl] = useState(initUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await axios(url);
        setData(result.data);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, isLoading, isError, doFetch: setUrl };
};

export { useHackerNewsApi, useDataApi };
