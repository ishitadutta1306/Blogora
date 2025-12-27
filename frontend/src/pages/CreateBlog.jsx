import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from 'axios'
import toast from 'react-hot-toast'
const API=import.meta.env.VITE_API_URL;

const CreateBlog=()=>{
  const token=localStorage.getItem("token");

  const [title, setTitle]=useState("");
  const [image, setImage]=useState(null);

  const editorRef=useRef(null);
  const quillRef=useRef(null);

  //generate with ai
  const [aiLoading, setAiLoading]=useState(false);
  const [aiRemaining, setAiRemaining]=useState(5);  //5 generations per day per user

  useEffect(() => {
    const fetchAIUsage = async () => {
      try {
        const res = await axios.get(`${API}/api/ai/usage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAiRemaining(res.data.remaining);
      } 
      catch (err) {
        console.error("Failed to fetch AI usage");
      }
    };

    fetchAIUsage();
  }, []);

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

      const res=await axios.post(`${API}/api/posts`,
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

  const handleGenerateAI=async () => {
    if (!title) {
      toast.error("Enter a title first");
      return;
    }

    try {
      setAiLoading(true);

      const res = await axios.post(`${API}/api/ai/generate-blog`, { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const generatedText = res.data.content;

      //Insert AI content into Quill editor
      quillRef.current.root.innerHTML = generatedText;

      //Update remaining count if backend sends it later
      if (res.data.remaining !== undefined) {
        setAiRemaining(res.data.remaining);
      } 
      else {
        setAiRemaining((prev) => prev - 1);
      }

      toast.success("AI content generated ✨");
    } 
    catch (err) {
      if (err.response?.status === 429) {
        toast.error("Daily AI limit reached (5/5)");
      } 
      else {
        toast.error("AI generation failed");
      }
    } 
    finally {
      setAiLoading(false);
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

            {/* AI usage info */}
            <p className="text-sm text-gray-500 mt-3">
              AI generations left today: {aiRemaining}/5
            </p>

            <div className="flex items-center gap-3 mt-4">
              {/* ✨ Generate with AI */}
              <button
                onClick={handleGenerateAI}
                disabled={aiLoading || aiRemaining <= 0}
                className={`px-6 py-2 rounded-full text-white font-medium
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                  hover:opacity-90 transition
                  hover:cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {aiLoading ? "Generating..." : "✨ Generate with AI"}
              </button>

              {/* Post Button */}
              <button
                onClick={handlePost}
                className="bg-black text-white px-6 py-2 rounded-full hover:cursor-pointer"
              >
                Post
              </button>
            </div>

            {/* <button onClick={handlePost} className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:cursor-pointer">
              Post
            </button> */}
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
