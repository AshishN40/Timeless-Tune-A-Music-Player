import React from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";

const Home = () => {
  const { songs, albums, loading } = SongData();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto">
          {albums?.map((e, i) => (
            <AlbumItem
              key={i}
              image={e?.thumbnail?.url || ''}
              name={e?.title || 'Untitled'}
              desc={e?.description || 'No description'}
              id={e?._id}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex  justify-center md:justify-start gap-4 items-center flex-wrap overflow-auto">
          {songs?.map((e, i) => (
            <SongItem
              key={i}
              image={e?.thumbnail?.url || ''}
              name={e?.title || 'Untitled'}
              desc={e?.description || 'No description'}
              id={e?._id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;