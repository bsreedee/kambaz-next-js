import { Button, ListGroupItem } from "react-bootstrap";

export default function TodoItem({ todo, deleteTodo, setTodo }: {
  todo: { id: string; title: string };
  deleteTodo: (id: string) => void;
  setTodo: (todo: { id: string; title: string }) => void;
}) {
  return (
    <ListGroupItem key={todo.id} className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <span className="me-3">{todo.title}</span>
             <div>
            <Button onClick={() => setTodo(todo)}
                    id="wd-set-todo-click" style={{ margin: "5px", backgroundColor: "blue", color: "white", border: "none"}}> Edit </Button>
            <Button onClick={() => deleteTodo(todo.id)}
                    id="wd-delete-todo-click" style={{ margin: "5px", backgroundColor: "red", color: "white", border: "none"}}> Delete </Button>
            </div>
            </div>
    </ListGroupItem>
            );}

