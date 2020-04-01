import React, { useState, useEffect } from "react";
import axios from "axios";
function HooksTest() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState(
    "https://hn.algolia.com/api/v1/search?query=redux"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          setUrl(`https://hn.algolia.com/api/v1/search?query=${query}`);
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export default HooksTest;
