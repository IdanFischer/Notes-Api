import express from "express";  
import cors from "cors";
import functions from "firebase-functions";
import { getAllNotes, addNote, updateNote, deleteNote } from "./src/notes.js";

const app = express()
app.use(express.json())
app.use(cors())

app.get("/notes", getAllNotes)

app.post("/notes", addNote)

app.patch("/notes/:notesId", updateNote)

app.delete("/notes/:notesId", deleteNote)

export const api = functions.https.onRequest(app)
