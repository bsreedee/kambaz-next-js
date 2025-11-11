"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { ListGroup, ListGroupItem } from "react-bootstrap";

// Define Todo type
interface Todo {
  id: string;
  title: string;
}

export default function ArrayStateVariable() {
  // Local array state
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5]);

  // Access todos from Redux
  const { todos } = useSelector((state: RootState) => state.todosReducer);

  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables" className="mt-3">
      <h2>Array State Variables</h2>

      <button onClick={addElement} className="btn btn-success mb-2">
        Add Element
      </button>

      <ul className="list-group mb-4">
        {array.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item}
            <button
              onClick={() => deleteElement(index)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3>Todos from Redux</h3>
      <ListGroup>
        {todos.map((todo: Todo) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>

      <hr />
    </div>
  );
}