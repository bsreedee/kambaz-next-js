import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);
  return (
    <div id="wd-counter-use-state">
      <h2>Counter: {count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        id="wd-counter-up-click" style={{backgroundColor: "green", color: "white",  marginRight: "5px", padding: "5px 15px", "border": "none"}}>Up</button>
      <button
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click" style={{backgroundColor: "red", color: "white", marginLeft: "5px", padding: "5px 15px", "border": "none"}}>Down</button>
<hr/></div>);
}

