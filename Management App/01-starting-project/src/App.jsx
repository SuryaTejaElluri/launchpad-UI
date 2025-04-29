import { useState } from "react";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectsSiderbar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject.jsx";


function App() {
    const [projectsState, setProjectsState] = useState({
        selectedProjectId: undefined,
        projects: [],
        tasks: {}, // Tasks are now organized per project
    });

    function handleAddTask(text) {
        setProjectsState((prevState) => {
            const taskId = Math.random();
            const newTask = {
                text: text,
                projectId: prevState.selectedProjectId,
                id: taskId,
            };

            const currentTasks = prevState.tasks[prevState.selectedProjectId] || [];
            const updatedTasks = [newTask, ...currentTasks];

            return {
                ...prevState,
                tasks: {
                    ...prevState.tasks,
                    [prevState.selectedProjectId]: updatedTasks,
                },
            };
        });
    }

    function handleDeleteTask(id) {
        setProjectsState((prevState) => {
            const updatedTasks = prevState.tasks[prevState.selectedProjectId].filter(
                (task) => task.id !== id
            );

            return {
                ...prevState,
                tasks: {
                    ...prevState.tasks,
                    [prevState.selectedProjectId]: updatedTasks,
                },
            };
        });
    }

    function handleStartAddProject() {
        setProjectsState((prevState) => ({
            ...prevState,
            selectedProjectId: null,
        }));
    }

    function handleSelectProject(id) {
        setProjectsState((prevState) => ({
            ...prevState,
            selectedProjectId: id,
        }));
    }

    function handleCancelAddProject() {
        setProjectsState((prevState) => ({
            ...prevState,
            selectedProjectId: undefined,
        }));
    }

    function handleAddProject(projectData) {
        setProjectsState((prevState) => {
            const projectId = Math.random();
            const newProject = {
                ...projectData,
                id: projectId,
            };

            return {
                ...prevState,
                selectedProjectId: undefined,
                projects: [...prevState.projects, newProject],
                tasks: {
                    ...prevState.tasks,
                    [projectId]: [], // Initialize tasks for the new project
                },
            };
        });
    }

    function handleDeleteProject() {
        setProjectsState((prevState) => {
            const { selectedProjectId } = prevState;

            const updatedProjects = prevState.projects.filter(
                (project) => project.id !== selectedProjectId
            );

            const { [selectedProjectId]: deletedProject, ...restTasks } = prevState.tasks;

            return {
                ...prevState,
                selectedProjectId: undefined,
                projects: updatedProjects,
                tasks: restTasks,
            };
        });
    }

    const selectedProject = projectsState.projects.find(
        (project) => project.id === projectsState.selectedProjectId
    );

    let content = (
        <SelectedProject
            project={selectedProject}
            onDelete={handleDeleteProject}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            tasks={projectsState.tasks[projectsState.selectedProjectId] || []}
        />
    );

    if (projectsState.selectedProjectId === null) {
        content = (
            <NewProject
                onAdd={handleAddProject}
                onCancel={handleCancelAddProject}
            />
        );
    } else if (projectsState.selectedProjectId === undefined) {
        content = (
            <NoProjectSelected onStartAddProject={handleStartAddProject} />
        );
    }

    return (
        <main className="h-screen my-8 flex gap-8">
            <ProjectsSiderbar
                onStartAddProject={handleStartAddProject}
                projects={projectsState.projects}
                onSelectProject={handleSelectProject}
            />
            {content}
        </main>
    );
}

export default App;
