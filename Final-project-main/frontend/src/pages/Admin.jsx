import React, { useState } from 'react'
import { UserData } from '../context/User'
import { Link, useNavigate } from 'react-router-dom';
import { SongData } from '../context/Song';
import { MdDelete } from "react-icons/md";
import AdSection from '../components/AdSection';

const Admin = () => {

    const { user } = UserData();
    const { albums, songs, addAlbum, loading, addSong, addThumbnail, deleteSong } = SongData();
    const navigate = useNavigate();
    if (user && user.role !== "admin") return navigate("/");

    // Album form states
    const [albumTitle, setAlbumTitle] = useState("");
    const [albumDescription, setAlbumDescription] = useState("");
    const [albumFile, setAlbumFile] = useState(null);

    // Song form states
    const [songTitle, setSongTitle] = useState("");
    const [songDescription, setSongDescription] = useState("");
    const [songFile, setSongFile] = useState(null);
    const [singer, setSinger] = useState("");
    const [album, setAlbum] = useState("");
    const [movie, setMovie] = useState("");

    const albumFileChangeHandler = (e) => {
        const file = e.target.files[0];
        setAlbumFile(file);
    }

    const songFileChangeHandler = (e) => {
        const file = e.target.files[0];
        setSongFile(file);
    }

    const addAlbumHandler = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", albumTitle);
        formData.append("description", albumDescription);
        formData.append("file", albumFile);
        addAlbum(formData, setAlbumTitle, setAlbumDescription, setAlbumFile);
    }

    const addSongHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", songTitle);
        formData.append("description", songDescription);
        formData.append("file", songFile);
        formData.append("singer", singer);
        formData.append("album", album);
        formData.append("movie", movie);
        addSong(formData, setSongTitle, setSongDescription, setSongFile, setSinger, setAlbum, setMovie);
    };

    const addThumbnailHandler = (id)=>{
        const formData = new FormData();
        formData.append("file", songFile);
        addThumbnail(id, formData, setSongFile);
    }

    const deleteHandler = (id) => {
        if(confirm("Are you Sure Want to Delete this Song?")){
            deleteSong(id);
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-300">
            <div className="w-4/5 bg-slate-200 text-slate-900 p-8">
                <Link to="/Home" className='bg-emerald-800 text-white font-bold px-4 py-2 rounded-full hover:bg-emerald-900 transition-colors'>Go to Home Page</Link>
                <h2 className='text-2xl font-bold mb-6 mt-6 text-slate-900'>Add Album</h2>

                <form onSubmit={addAlbumHandler} className='bg-slate-200 p-6 rounded-lg shadow-lg border border-slate-400'>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Title</label>
                        <input type='text' placeholder='Title' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Description</label>
                        <input type='text' placeholder='Description' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' value={albumDescription} onChange={e => setAlbumDescription(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Thumbnail</label>
                        <input type='file' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' accept='image/*' onChange={albumFileChangeHandler} required />
                    </div>
                    <button disabled={loading} className='bg-emerald-800 text-white px-6 py-2 rounded-md hover:bg-emerald-900 transition-colors disabled:opacity-50' style={{ width: "100px" }}>{loading ? "Please Wait..." : "Add"}</button>
                </form>

                <h2 className='text-2xl font-bold mb-6 mt-6 text-slate-900'>Add Songs</h2>

                <form onSubmit={addSongHandler} className='bg-slate-200 p-6 rounded-lg shadow-lg border border-slate-400'>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Title</label>
                        <input type='text' placeholder='Title' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' value={songTitle} onChange={e => setSongTitle(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Description</label>
                        <input type='text' placeholder='Description' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' value={songDescription} onChange={e => setSongDescription(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Singer</label>
                        <input type='text' placeholder='Singer' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' value={singer} onChange={e => setSinger(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Movie Name</label>
                        <input type='text' placeholder='Movie Name (Optional)' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' value={movie} onChange={e => setMovie(e.target.value)} />
                    </div>

                    <select className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 mb-4 bg-white' value={album} onChange={e => setAlbum(e.target.value)} required>
                        <option value="">Select Album</option>
                        {albums && albums.map((e, i) => (
                            <option value={e._id} key={i}>{e.title}</option>
                        ))}
                    </select>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-slate-900">Audio</label>
                        <input type='file' className='w-full px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white' accept='audio/*' onChange={songFileChangeHandler} required />
                    </div>
                    <button disabled={loading} className='bg-emerald-800 text-white px-6 py-2 rounded-md hover:bg-emerald-900 transition-colors disabled:opacity-50' style={{ width: "100px" }}>{loading ? "Please Wait..." : "Add"}</button>
                </form>
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900">Added Songs</h3>
                    <div className="flex justify-center md:justify-start gap-4 items-center flex-wrap">
                        {
                            songs && songs.map((e, i) => (
                                <div key={i} className="bg-slate-200 p-4 rounded-lg shadow-md border border-slate-400 w-[calc(16.666%-1rem)]">
                                    {
                                        e.thumbnail ? <img src={e.thumbnail.url} alt="" className='mr-1 w-52 h-52 object-cover rounded-md' /> : <div className="flex flex-col justify-center items-center gap-2">
                                            <input type='file' onChange={songFileChangeHandler} className='mb-2' />
                                            <button onClick={()=> addThumbnailHandler(e._id)} className='bg-emerald-800 text-white px-4 py-2 rounded-md hover:bg-emerald-900 transition-colors'>Add Thumbnail</button>
                                        </div>
                                    }
                                    <h4 className='text-lg font-bold text-slate-900 mt-2 truncate' title={e.title}>{e.title}</h4>
                                    <h4 className='text-sm text-slate-800 truncate' title={e.singer}>{e.singer}</h4>
                                    {e.movie && <h4 className='text-sm text-slate-800 truncate' title={e.movie}>Movie: {e.movie}</h4>}
                                    <h4 className='text-sm text-slate-800 mb-2 truncate' title={e.description}>{e.description}</h4>
                                    <button onClick={()=> deleteHandler(e._id)} className='px-3 py-1 bg-rose-800 text-white rounded-md hover:bg-rose-900 transition-colors'><MdDelete /></button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="w-1/5 relative bg-slate-300">
                <AdSection />
            </div>
        </div>
    )
}

export default Admin