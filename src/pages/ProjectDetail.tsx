import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  Calendar, 
  Users as UsersIcon,
  Settings,
  CheckCircle2,
  MoreHorizontal,
  Pencil,
  Trash2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { EditProjectModal } from '../components/dashboard/EditProjectModal';
import { AddMemberModal } from '../components/dashboard/AddMemberModal';
import { mockUsers } from '../data/mockData';
import { formatDueDate } from '../utils/dateUtils';
import { cn } from '../utils/cn';

const generateId = (prefix: string) => `${prefix}_${Date.now()}`;

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, updateTask, deleteTask } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState<string | undefined>(undefined);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-text-primary">Project not found</h2>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  const filteredTasks = projectTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumns = Array.from(project.columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      updateProject(project.id, { columns: newColumns });
      return;
    }

    // Update task status
    updateTask(draggableId, { status: destination.droppableId });
  };

  const addColumn = () => {
    const title = window.prompt('Enter column title:');
    if (!title) return;

    const newColumn = {
      id: generateId('col'),
      title,
      color: 'bg-gray-100'
    };

    updateProject(project.id, { 
      columns: [...project.columns, newColumn] 
    });
  };

  const deleteColumn = (columnId: string) => {
    if (!window.confirm('Are you sure you want to delete this column? Tasks in this column will remain but won\'t be visible in the board view until moved.')) return;
    
    updateProject(project.id, {
      columns: project.columns.filter(c => c.id !== columnId)
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <button onClick={() => navigate('/projects')} className="hover:text-primary transition-colors">Projects</button>
          <span>/</span>
          <span className="text-text-primary font-medium">{project.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary">{project.name}</h1>
            <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">{project.description}</p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Owner</span>
                <div className="flex items-center gap-2">
                  <img 
                    src={mockUsers.find(u => u.id === project.ownerId)?.avatarUrl} 
                    className="w-6 h-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-medium text-text-primary">
                    {mockUsers.find(u => u.id === project.ownerId)?.fullName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Due Date</span>
                <div className="flex items-center gap-2 text-xs font-medium text-text-primary">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  {new Date(project.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Members</span>
                <div className="flex items-center -space-x-2">
                  {project.memberIds.map(id => (
                    <img 
                      key={id} 
                      src={mockUsers.find(u => u.id === id)?.avatarUrl} 
                      className="w-6 h-6 rounded-full border-2 border-surface"
                      referrerPolicy="no-referrer"
                      title={mockUsers.find(u => u.id === id)?.fullName}
                    />
                  ))}
                  <button 
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="w-6 h-6 rounded-full bg-gray-100 border-2 border-surface flex items-center justify-center text-text-secondary hover:bg-gray-200 transition-colors z-10"
                    title="Add Member"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2" onClick={() => setIsEditProjectModalOpen(true)}>
              <Settings className="w-4 h-4" /> Edit Project
            </Button>
            <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* View Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg border border-border">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <ListIcon className="w-3.5 h-3.5" /> List
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                viewMode === 'board' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              className="w-full h-9 pl-10 pr-4 bg-gray-50 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <UsersIcon className="w-4 h-4" /> Assignee
          </Button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Task Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map(task => {
                  const assignee = mockUsers.find(u => u.id === task.assigneeId);
                  return (
                    <tr 
                      key={task.id} 
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
                            }}
                            className={cn(
                              'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                              task.status === 'done' ? 'bg-success border-success text-white' : 'border-border hover:border-primary'
                            )}
                          >
                            {task.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                          <span className={cn(
                            'text-sm font-medium text-text-primary',
                            task.status === 'done' && 'line-through text-text-secondary'
                          )}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={assignee?.avatarUrl} 
                            className="w-6 h-6 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs text-text-primary">{assignee?.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={task.status === 'done' ? 'success' : task.status === 'inReview' ? 'warning' : task.status === 'inProgress' ? 'primary' : 'default'}>
                          {project.columns.find(c => c.id === task.status)?.title || task.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'primary' : 'default'}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Calendar className="w-3 h-3" />
                          {formatDueDate(task.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg text-text-secondary transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Delete this task?')) deleteTask(task.id);
                            }}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              >
                {project.columns.map((col, index) => (
                  <Draggable key={col.id} draggableId={col.id} index={index}>
                    {(provided) => (
                      <div 
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="flex-shrink-0 w-80 space-y-4"
                      >
                        <div {...provided.dragHandleProps} className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-text-primary">{col.title}</h3>
                            <span className="text-[10px] font-bold text-text-secondary bg-gray-100 px-1.5 py-0.5 rounded">
                              {filteredTasks.filter(t => t.status === col.id).length}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => deleteColumn(col.id)}
                              className="p-1 hover:bg-red-50 rounded text-error opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Column"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                            </button>
                          </div>
                        </div>
                        
                        <Droppable droppableId={col.id} type="task">
                          {(provided, snapshot) => (
                            <div 
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={cn(
                                'p-2 rounded-xl min-h-[500px] space-y-3 transition-colors', 
                                col.color,
                                snapshot.isDraggingOver && 'ring-2 ring-primary/20'
                              )}
                            >
                              {filteredTasks.filter(t => t.status === col.id).map((task, index) => {
                                const assignee = mockUsers.find(u => u.id === task.assigneeId);
                                return (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div 
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn(
                                          "card p-4 hover:shadow-md transition-all cursor-pointer group",
                                          snapshot.isDragging && "shadow-xl ring-2 ring-primary"
                                        )}
                                        onClick={() => setSelectedTask(task)}
                                      >
                                        <div className="flex items-start justify-between mb-3">
                                          <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'primary' : 'default'} className="text-[10px]">
                                            {task.priority}
                                          </Badge>
                                          <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-3 h-3 text-text-secondary" />
                                          </button>
                                        </div>
                                        <h4 className="text-sm font-semibold text-text-primary mb-4 leading-relaxed">{task.title}</h4>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                                            <Calendar className="w-3 h-3" />
                                            {formatDueDate(task.dueDate)}
                                          </div>
                                          <img 
                                            src={assignee?.avatarUrl} 
                                            className="w-6 h-6 rounded-full border border-border"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                              <button 
                                onClick={() => {
                                  setCreateTaskDefaultStatus(col.id);
                                  setIsCreateModalOpen(true);
                                }}
                                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                              >
                                <Plus className="w-3 h-3" /> Add Task
                              </button>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {/* Add Column Button */}
                <div className="flex-shrink-0 w-80">
                  <button 
                    onClick={addColumn}
                    className="w-full h-[100px] border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Column
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateTaskDefaultStatus(undefined);
        }} 
        defaultProjectId={project.id}
        defaultStatus={createTaskDefaultStatus}
      />

      <EditProjectModal
        key={`${project.id}-${isEditProjectModalOpen}`}
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        project={project}
      />

      <AddMemberModal
        key={`${project.id}-members-${isAddMemberModalOpen}`}
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        project={project}
      />
    </div>
  );
};

export default ProjectDetail;
