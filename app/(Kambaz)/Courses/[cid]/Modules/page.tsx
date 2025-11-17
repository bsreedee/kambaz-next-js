/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import * as client from "../../client";
import { useParams } from "next/navigation";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { addModule, editModule, updateModule, deleteModule, setModules }from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";


export default function Modules() {
  const { cid } = useParams();
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);
  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };
  const onUpdateModule = async (module: any) => {
    await client.updateModule(module);
    const newModules = modules.map((m: any) =>
      m._id === module._id ? module : m
    );
    dispatch(setModules(newModules));
  };
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  return (
    <div className="wd-modules">
      {isFaculty && (
        <ModuleControlButtons
                  moduleId={(module as any)._id}
                  deleteModule={(moduleId) => onRemoveModule(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
      )}
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules

          .map((module: any) => (

        <ListGroupItem 
        key={module._id} 
        className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> 
            {!module.editing && module.name}
            {module.editing && isFaculty && (
                <FormControl 
                  className="w-50 d-inline-block"
                  onChange={(e) => 
                    dispatch(
                      updateModule({ ...module, name: e.target.value })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(updateModule({ ...module, editing: false }));
                    }
                  }}
                  defaultValue={module.name}
                />
            )}
            {module.editing && !isFaculty && module.name}

            {isFaculty && (
              <ModuleControlButtons 
                moduleId={module._id}
                deleteModule={(moduleId) => {
                  dispatch(deleteModule(moduleId));
                }} 
                editModule={(moduleId) => dispatch(editModule(moduleId))} 
              />
            )}
          </div>
          {module.lessons && (
            <ListGroup className="wd-lessons rounded-0">
              {module.lessons.map((lesson: any) => (
              <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1"> 
                <BsGripVertical className="me-2 fs-3" /> 
                {lesson.name} 
                <LessonControlButtons />
              </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </ListGroupItem>
      ))}
      </ListGroup>
    </div>
  );
}