import { useState, useEffect } from 'react'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    noteService     
      .getAll()
      .then(response => {       
        setNotes(response)
      })  
  }, [])  


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: text,
      important: Math.random() < 0.5,
    }
    
    noteService    
      .create(noteObject)    
      .then(response => {
        setNotes(notes.concat(response))
        setText('')
      })
  }
  
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  
  const handleText = (event) => {
    setText(event.target.value)
  }
  
  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important : !note.important}

    noteService 
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(n => n.id !== id ? n :response))
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  return(
    <>
      <Form addNote={addNote} handleText={handleText} text={text}/>
      <button onClick={() => setShowAll(!showAll)}>Show {showAll ? 'important' : 'all'} </button>
      <ul>
        <NoteList notesToShow ={notesToShow} toggleImportance={toggleImportance} />
      </ul>
    </>
  )
  
}


const NoteList = ({notesToShow, toggleImportance}) => {
  return(notesToShow.map((note) => <>
    <li key={note.id}>{note.content}</li>
    <button onClick={() => toggleImportance(note.id)}>{note.important? <b>make not important</b> : <b>make important</b>}</button>
  </>))
}


const Form = ({addNote, handleText, text}) => {
  return(
    <form onSubmit={addNote}>
      <div>
        New Quote <input type="text" value={text} onChange={handleText}/>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

export default App