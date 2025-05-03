import { Song } from "../models/Song.js";
import { Album } from "../models/Album.js";
import TryCatch from "../utills/TryCatch.js"
import getDataurl from "../utills/urlGenerator.js"
import cloudinary from "cloudinary";
// Import other necessary models...

export const searchItems = async (req, res) => {
  const { query } = req.query;

  try {
    const songs = await Song.find({ title: { $regex: query, $options: "i" } });
    const albums = await Album.find({ title: { $regex: query, $options: "i" } });
    // Add more searches for playlists and genres if applicable...

    res.status(200).json({ songs, albums /*, playlists, genres */ });
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results", error });
  }
};

// Existing controller functions...
export const createAlbum = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description } = req.body;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Album.create({
    title,
    description,
    thumbnail: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
  });

  res.json({
    message: "Album Added",
  });
});

export const getAllAlbums = TryCatch(async (req, res) => {
  const albums = await Album.find();

  res.json(albums);
});

export const addSong = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, singer, album, movie } = req.body;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
    resource_type: "video",
  });

  await Song.create({
    title,
    description,
    singer,
    movie,
    audio: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    album,
  });

  res.json({
    message: "Song Added",
  });
});

export const addThumbnail = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Song.findByIdAndUpdate(
    req.params.id,
    {
      thumbnail: {
        id: cloud.public_id,
        url: cloud.secure_url,
      },
    },
    { new: true }
  );

  res.json({
    message: "thumbnail Added",
  });
});

export const getAllSongs = TryCatch(async (req, res) => {
  const songs = await Song.find();

  res.json(songs);
});

export const getAllSongsByAlbum = TryCatch(async (req, res) => {
  const album = await Album.findById(req.params.id);
  const songs = await Song.find({ album: req.params.id });

  res.json({ album, songs });
});

export const deleteSong = TryCatch(async (req, res) => {
  const song = await Song.findById(req.params.id);

  await song.deleteOne();

  res.json({ message: "Song Deleted" });
});

export const getSingleSong = TryCatch(async (req, res) => {
  const song = await Song.findById(req.params.id);

  res.json(song);
});