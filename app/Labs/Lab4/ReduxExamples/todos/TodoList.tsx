import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { addTodo, deleteTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";

export default function TodoList() {
  // Get state from Redux store
  const { todos, todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();

  // Create handler functions that dispatch Redux actions
  const handleAddTodo = (todo: { id: string; title: string }) => {
    dispatch(addTodo(todo));
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleUpdateTodo = (todo: { id: string; title: string }) => {
    dispatch(updateTodo(todo));
  };

  const handleSetTodo = (todo: { id: string; title: string }) => {
    dispatch(setTodo(todo));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm
          todo={todo}
          setTodo={handleSetTodo}
          addTodo={handleAddTodo}
          updateTodo={handleUpdateTodo}
        />
        {todos.map((todo) => (
          <TodoItem key={todo.id}
            todo={todo}
            deleteTodo={handleDeleteTodo}
            setTodo={handleSetTodo} />
        ))}
      </ListGroup>
      <hr/>
    </div>
  );
}
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../store"; 
// import { useState } from "react";
// import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
// import TodoForm from "./TodoForm";
// import TodoItem from "./TodoItem";

// export default function TodoList() {
//   const [todos, setTodos] = useState([
//     { id: "1", title: "Learn React" },
//     { id: "2", title: "Learn Node"  }]);
//   const [todo, setTodo] = useState({ id: "-1", title: "Learn Mongo" });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const addTodo = (todo: any) => {
//     const newTodos = [ ...todos, { ...todo,
//       id: new Date().getTime().toString() }];
//     setTodos(newTodos);
//     setTodo({id: "-1", title: ""});
//   };
//   const deleteTodo = (id: string) => {
//     const newTodos = todos.filter((todo) => todo.id !== id);
//     setTodos(newTodos);
//   };
  
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const updateTodo = (todo: any) => {
//     const newTodos = todos.map((item) =>
//       (item.id === todo.id ? todo : item));
//     setTodos(newTodos);
//     setTodo({id: "-1", title: ""});
//   };
//   return (
//     <div>
//       <h2>Todo List</h2>
//       <ListGroup>
//         <TodoForm
//           todo={todo}
//           setTodo={setTodo}
//           addTodo={addTodo}
//           updateTodo={updateTodo}/>
//         {todos.map((todo) => (
//           <TodoItem key={todo.id}
//             todo={todo}
//             deleteTodo={deleteTodo}
//             setTodo={setTodo} />
//         ))}
//       </ListGroup>

//       {/* <ListGroup>
//         <ListGroupItem>
//           <div className="d-flex gap-2">
//             <FormControl value={todo.title}
//               onChange={(e) => setTodo({ ...todo, title: e.target.value })} className="me-auto"/>
//                 <Button onClick={() => updateTodo(todo)}
//                     id="wd-update-todo-click" style={{ margin: "5px", backgroundColor: "yellow", color: "black", border: "none"}}> Update </Button>
//                 <Button onClick={() => addTodo(todo)}
//                     id="wd-add-todo-click" style={{ margin: "5px", backgroundColor: "green", border: "none", color: "white"}}> Add </Button>
//            </div>  
//         </ListGroupItem>
//           {todos.map((todo) => (
//           <ListGroupItem key={todo.id} className="mb-2">
//             <div className="d-flex justify-content-between align-items-center">
//               <span className="me-3">{todo.title}</span>
//              <div>
//             <Button onClick={() => setTodo(todo)}
//                     id="wd-set-todo-click" style={{ margin: "5px", backgroundColor: "blue", color: "white", border: "none"}}> Edit </Button>
//             <Button onClick={() => deleteTodo(todo.id)}
//                     id="wd-delete-todo-click" style={{ margin: "5px", backgroundColor: "red", color: "white", border: "none"}}> Delete </Button>
//             </div>
//             </div>
//             </ListGroupItem>
//         ))}
//       </ListGroup> */}
//       <hr/>
// </div>
// );
// }

