import { useCallback, useEffect, useState,useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { EditerSocket } from "../services/socketconnection"

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor({Id}) {
  const socket=useRef();
  const [quill, setQuill] = useState()

  useEffect(() => {
    socket.current = EditerSocket().connect();
    return () => {
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket.current == null || quill == null) return

    socket.current.on("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.current.emit("get-document", Id)
  }, [socket.current, quill, Id])

  useEffect(() => {
    if (socket.current == null || quill == null) return

    const interval = setInterval(() => {
      socket.current.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket.current, quill])

  useEffect(() => {
    if (socket.current == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.current.on("receive-changes", handler)

    return () => {
      socket.current.off("receive-changes", handler)
    }
  }, [socket.current, quill])

  useEffect(() => {
    if (socket.current == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.current.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket.current, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q=new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])
  return <div className="container" ref={wrapperRef}></div>
}