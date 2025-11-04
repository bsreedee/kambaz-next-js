import { Button, FormControl, ListGroupItem } from "react-bootstrap";

export default function TodoForm({ todo, setTodo, addTodo, updateTodo }: {
  todo: { id: string; title: string };
  setTodo: (todo: { id: string; title: string }) => void;
  addTodo: (todo: { id: string; title: string }) => void;
  updateTodo: (todo: { id: string; title: string }) => void;
}) {
  return (
   <div className="d-flex gap-2">
            <FormControl value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })} className="me-auto"/>
                <Button onClick={() => updateTodo(todo)}
                    id="wd-update-todo-click" style={{ margin: "5px", backgroundColor: "yellow", color: "black", border: "none"}}> Update </Button>
                <Button onClick={() => addTodo(todo)}
                    id="wd-add-todo-click" style={{ margin: "5px", backgroundColor: "green", border: "none", color: "white"}}> Add </Button>
           </div>  
);}

