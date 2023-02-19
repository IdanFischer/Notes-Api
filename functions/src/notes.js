import dbConnect from "./dbConnect.js";
import { FieldValue } from "firebase-admin/firestore";

// ---------- GET ----------
export async function getAllNotes(req, res) {
  const db = await dbConnect()
  // this connects to the database
  db.collection('notes').orderBy('createdAt', "desc").get()
    // this hits the notes collection, orders by the time they were created at, then gets all of them since there is no speific id to the get
    .then(collection => {
      const notes = collection.docs.map(doc => ({ notesId: doc.id, ...doc.data() }))
      res.send(notes)
      // once the collection comes back, this anon function will run that will use the param doc to map through all the docs of the notes collection, then runs another anon function that sets the key notesId: to the value of the doc.id, and sends back the data of the doc in question
    })
    // error handling
    .catch(err => res.status(500).json({ error: err.message }))
}

// ---------- ADD ----------
export async function addNote(req, res) {
  // looks for the note property only, that way nothing else can be added unless having the "note" key
  const { note } = req.body
  // makes a new object with the note key/value, (its like saying note: note) and the createdAt key and the value being the time it was made
  const newNote = { note, createdAt: FieldValue.serverTimestamp() }
  // connects to the database
  const db = await dbConnect()

  // Looks for the collection called 'notes' and adds the newNote that was made above
  db.collection('notes').add(newNote)
    // When you send a post, it also gets all the docs so that way it cuts the time and allows the new list to come back with the new post
    .then(() => getAllNotes(req, res))
    // error handling
    .catch(err => res.status(500).json({ error: err.message }))
}

// ---------- UPDATE ----------

export async function updateNote(req, res) {
  // looks for the note property only, that way nothing else can be updated unless having the "note" key
  const { note } = req.body
  // looks for the params of the url, that being the notesId that i assigned to each note property
  const { notesId } = req.params
  // connects to the database
  const db = await dbConnect()

  // Looks for the collection called 'notes', then it will look for the document with the right id (which is coming from notesId), then updates the property note {note: ""} to what was inputed 
  db.collection('notes').doc(notesId).update({ note })
    // When you update a doc, it also gets all the docs so that way it cuts the time and allows the new list to come back with the updated doc
    .then(() => getAllNotes(req, res))
    // error handling 
    .catch(err => res.status(500).json({ error: err.message }))
}

// ---------- DELETE ----------
export async function deleteNote(req, res) {
  // looks for the params of the url, that being the notesId that i assigned to each note property
  const { notesId } = req.params
  // connects to the database
  const db = await dbConnect()

  //  Looks for the collection called 'notes', then it will look for the document with the right id (which is coming from notesId), then will delete the doc that it finds
  db.collection('notes').doc(notesId).delete()
    // When you delete a doc, it also gets all the docs so that way it cuts the time and allows the new list to come back with the docs minus the one that was deleted
    .then(() => getAllNotes(req, res))
    // error handling
    .catch(err => res.status(500).json({ error: err.message }))
}
