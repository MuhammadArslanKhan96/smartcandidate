"use client";
import { db } from "@/utils/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const UsersTableAdmin: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map((doc) => doc.data());
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFroze = async (email: string, isFrozen?: boolean) => {
    setUsers(prev => ([...prev.filter(user => user.email !== email), {
      ...prev.find(user => user.email === email),
      isFrozen: !isFrozen
    }]));


    await updateDoc(doc(db, "users", email), {
      isFrozen: !isFrozen
    })
  }

  return (
    <div className="p-4">

      

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Committee
              </th>
              <th scope="col" className="px-6 py-3">
                Freeze/Unfreeze
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.email} className="bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <td className="px-6 py-4">{user.name || user.displayName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4">
                    {user.committee}
                  </td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => handleFroze(user.email, user?.isFrozen)}>{!user?.isFrozen ? "Freeze" : "Unfreeze"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="ml-2 text-sm text-gray-500 "
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span className="ml-4">0-0 of 0</span>
        <button className="ml-4 rounded bg-gray-300 px-2 py-1 hover:bg-gray-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button className="ml-2 rounded bg-gray-300 px-2 py-1 hover:bg-gray-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UsersTableAdmin;