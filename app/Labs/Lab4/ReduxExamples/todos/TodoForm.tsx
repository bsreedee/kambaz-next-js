import { Button, FormControl, ListGroupItem } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";

export default function TodoForm() {

  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroupItem  key={todo.id} >
   <div className="d-flex gap-2">
            <FormControl value={todo.title}
              onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))} className="me-auto"/>
                <Button onClick={() => dispatch(updateTodo(todo))}
                    id="wd-update-todo-click" style={{ margin: "5px", backgroundColor: "yellow", color: "black", border: "none"}}> Update </Button>
                <Button onClick={() => dispatch(addTodo(todo))}
                    id="wd-add-todo-click" style={{ margin: "5px", backgroundColor: "green", border: "none", color: "white"}}> Add </Button>
           </div>  
    </ListGroupItem>
);}

