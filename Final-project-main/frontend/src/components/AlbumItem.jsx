import React from 'react'
import { useNavigate } from 'react-router-dom'

const truncateText = (text, wordCount) => {
  const words = text.split(' ');
  if (words.length > wordCount) {
    return words.slice(0, wordCount).join(' ') + '...';
  }
  return text;
};

const AlbumItem = ({image, name, desc, id}) => {
    const navigate = useNavigate();
  return (
    <div onClick={()=> navigate("/album/" +id)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
        <img src= {image} className='rounded w-[160px]' alt=''/>
        <p className="font-bold mt-2 mb-1 w-[160px] truncate">{truncateText(name, 15)}</p>
        <p className="text-slate-200 text-sm w-[160px] truncate">{truncateText(desc, 15)}</p>
    </div>
  )
}

export default AlbumItem