import { Button, ListGroupItem } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();

  return (
    <ListGroupItem key={todo.id} className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <span className="me-3">{todo.title}</span>
             <div>
            <Button onClick={() => dispatch(setTodo(todo))}
                    id="wd-set-todo-click" style={{ margin: "5px", backgroundColor: "blue", color: "white", border: "none"}}> Edit </Button>
            <Button onClick={() => dispatch(deleteTodo(todo.id))}
                    id="wd-delete-todo-click" style={{ margin: "5px", backgroundColor: "red", color: "white", border: "none"}}> Delete </Button>
            </div>
            </div>
    </ListGroupItem>
            );}

