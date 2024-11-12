import { useEffect, useState } from "react";
import { Spin, Card, Button, Modal, Input } from "antd";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos from Firebase
  const fetchTodos = async () => {
    setLoading(true);
    const todosCollection = collection(db, "todos");
    const todosSnapshot = await getDocs(todosCollection);
    const todosList = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTodos(todosList);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddOrUpdateTodo = async () => {
    if (newTodoTitle.trim()) {
      if (isEditing) {
        // Update existing todo
        const todoRef = doc(db, "todos", editingTodo.id);
        await updateDoc(todoRef, { title: newTodoTitle });
        setIsEditing(false);
        setEditingTodo(null);
      } else {
        // Add new todo
        await addDoc(collection(db, "todos"), { title: newTodoTitle, completed: false });
      }
      fetchTodos();
      setNewTodoTitle("");
    }
  };

  const handleToggleComplete = async (id, completed) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, { completed: !completed });
    fetchTodos();
  };

  const handleDeleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    fetchTodos();
  };

  const handleEditTodo = (todo) => {
    setIsEditing(true);
    setEditingTodo(todo);
    setNewTodoTitle(todo.title); // Pre-fill input with the current title
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto md:p-0 pt-10">
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-100">Todo List</h1>
        <p className="text-lg text-gray-200 mt-2">Stay organized and productive</p>
      </div>

      {/* Input and Add Button */}
      <div className="flex flex-col md:flex-row items-center justify-center mb-6">
        <Input
          placeholder="Enter todo title..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="mb-4 md:mb-0 w-full md:w-2/3 text-xl py-2 px-4 rounded-lg shadow-md border-gray-300"
        />
        <Button
          type="none"
          onClick={handleAddOrUpdateTodo}
          className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto py-5 bg-green-600 hover:bg-green-500 hover:border-white text-white font-semibold text-lg"
        >
          {isEditing ? "Update Todo" : "Add Todo"}
        </Button>
      </div>

      {/* Todo List - Displaying 2 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            title={
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-lg ${todo.completed ? 'text-green-600' : 'text-red-600'}`}>
                  {todo.title}
                </span>
                <span className={`text-sm ${todo.completed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} px-2 py-1 rounded-full`}>
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
            }
            className={`shadow-lg rounded-xl p-4 transition-all duration-300 ${
              todo.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
            }`}
          >
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                type="link"
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
                className={`text-${todo.completed ? 'red' : 'green'}-500 hover:text-${todo.completed ? 'red' : 'green'}-700`}
              >
                {todo.completed ? "Mark Incomplete" : "Mark Complete"}
              </Button>
              <Button
                type="link"
                onClick={() => handleEditTodo(todo)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Button>
              <Button
                type="link"
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
