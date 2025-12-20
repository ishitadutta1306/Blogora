import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from 'axios'
import toast from 'react-hot-toast'

const CreateBlog=()=>{
  const token=localStorage.getItem("token");

  const [title, setTitle]=useState("");
  const [image, setImage]=useState(null);

  const editorRef=useRef(null);
  const quillRef=useRef(null);

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(()=>{
    if (!quillRef.current){
      quillRef.current=new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your blog...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  const handleImageUpload=(e)=>{
    const file=e.target.files[0];
    if (file){
      setImage(file);
    } 
  };

  const handlePost=async()=>{
    try {
      const contentHTML = quillRef.current.root.innerHTML;

      if (!title || contentHTML === "<p><br></p>") {
        toast.error("Title and content required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", contentHTML);
      formData.append("status", "published");

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Blog posted successfully 🎉");
      setTitle("");
      setImage(null);
      quillRef.current.root.innerHTML = "";
    } 
    catch (err) {
      console.error(err);
      toast.error("Failed to post blog");
    }
  };


  return (
    <>
      <Navbar />
      <Sidebar />

      <div className=" mt-10 ml-64 px-8 py-10 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Tell your story...</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-medium outline-none mb-4 "
            />

            <div className="h-[55vh] overflow-y-auto">
              <div ref={editorRef} className="bg-white" />
            </div>

            <button onClick={handlePost} className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:cursor-pointer">
              Post
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
              <span className="text-gray-700">Add an image</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-4 rounded-lg max-h-48 object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBlog;
