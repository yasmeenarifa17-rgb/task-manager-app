import { useEffect, useState } from "react";
import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  // CHECK LOGIN STATUS

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {

        if (currentUser) {
          setUser(currentUser);
        } else {
          navigate("/");
        }

      }
    );

    return () => unsubscribe();

  }, []);

  // ADD TASK

  const addTask = async () => {

    if (task.trim() === "") return;

    await addDoc(collection(db, "tasks"), {
      title: task,
      status: "Pending",
      createdAt: new Date(),
      userId: user.uid,
      userEmail: user.email,
    });

    setTask("");
  };

  // FETCH USER TASKS ONLY

  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskData);

    });

    return () => unsubscribe();

  }, [user]);

  // DELETE TASK

  const deleteTask = async (id) => {

    await deleteDoc(doc(db, "tasks", id));

  };

  // UPDATE STATUS

  const updateStatus = async (id, currentStatus) => {

    const newStatus =
      currentStatus === "Pending"
        ? "Completed"
        : "Pending";

    await updateDoc(doc(db, "tasks", id), {
      status: newStatus,
    });

  };

  // LOGOUT

  const logoutUser = async () => {

    await signOut(auth);
    navigate("/");

  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* TOP BAR */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            Task Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            {user?.email}
          </p>
        </div>

        <button
          onClick={logoutUser}
          className="bg-red-500 text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>

      </div>

      {/* ADD TASK */}

      <div className="bg-white p-6 rounded-2xl shadow mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 border p-3 rounded-xl outline-none"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Add Task
          </button>

        </div>

      </div>

      {/* EMPTY STATE */}

      {tasks.length === 0 && (

        <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
          No tasks added yet
        </div>

      )}

      {/* TASKS */}

      <div className="grid gap-4">

        {tasks.map((item) => (

          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >

            <div>

              <h2 className="text-xl font-semibold">
                {item.title}
              </h2>

              <p
                className={
                  item.status === "Completed"
                    ? "text-green-600 font-medium"
                    : "text-yellow-600 font-medium"
                }
              >
                {item.status}
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  updateStatus(item.id, item.status)
                }
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Update
              </button>

              <button
                onClick={() => deleteTask(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}