import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminPanel(){
  const [movies,setMovies]=useState([]);
  const [showAdd,setShowAdd]=useState(false);
  const fetch = ()=> API.get('/api/movies').then(r=> setMovies(r.data.movies || []));
  useEffect(()=>{ fetch() },[]);
  const del = async (id)=>{ await API.delete('/api/admin/delete/'+id); fetch(); };
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Admin Panel</h2>
      <button onClick={()=>setShowAdd(!showAdd)} className="bg-green-600 px-3 py-1 rounded mb-4">Add Movie</button>
      {showAdd && <AddForm onAdded={()=>{ setShowAdd(false); fetch(); }} />}
      <div className="grid grid-cols-3 gap-4">
        {movies.map(m=> <div key={m._id} className="bg-gray-800 p-3 rounded flex justify-between items-center">
          <div>{m.title}</div>
          <div className="flex gap-2">
            <button onClick={()=>del(m._id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
          </div>
        </div>)}
      </div>
    </div>
  )
}

function AddForm({ onAdded }){
  const [title,setTitle]=useState(''); const [overview,setOverview]=useState('');
  const add = async (e)=>{ e.preventDefault(); await API.post('/api/admin/add',{ title, overview }); onAdded(); };
  return (
    <form onSubmit={add} className="bg-gray-900 p-4 rounded mb-4">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 mb-2 bg-gray-800 rounded" />
      <textarea value={overview} onChange={e=>setOverview(e.target.value)} placeholder="Overview" className="w-full p-2 mb-2 bg-gray-800 rounded" />
      <button className="bg-red-600 px-3 py-1 rounded">Add</button>
    </form>
  )
}
