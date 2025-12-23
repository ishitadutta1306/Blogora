import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import toast from "react-hot-toast";

const EditBlog = () => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [postId, setPostId] = useState(null);


  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [quillReady, setQuillReady] = useState(false);

  if (!token) return <Navigate to="/login" />;

  // 1️⃣ Init Quill (ONCE)
  useEffect(() => {
    if (!editorRef.current) return;
    if (quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
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

    setQuillReady(true); //trigger
  }, []);

  // 2️⃣ Fetch post AFTER Quill exists
  useEffect(() => {
    if (!quillReady) return;

    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // setPostId(res.data._id);

        // const post = res.data;
        // setTitle(post.title || "");

        // setExistingImage(post.coverImage || post.image || null);

        // quillRef.current.clipboard.dangerouslyPasteHTML(post.content || "");
        setPostId(res.data._id);
        setTitle(res.data.title);
        setExistingImage(res.data.coverImage || res.data.image || null);
        quillRef.current.clipboard.dangerouslyPasteHTML(res.data.content || "");
        // setLoading(false);

        // console.log("POST DATA 👉", res.data);
      } 
      catch (err) {
        console.error(err);
        toast.error("Failed to load post");
      } 
      finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [quillReady, slug, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

//   if (!postId) {
//     toast.error("Post not ready yet");
//     return;
//   }

  const handleUpdate = async () => {
    if (!postId) {
      toast.error("Post not ready yet");
      return;
    }

    try {
      const contentHTML = quillRef.current.root.innerHTML;

      if (!title || contentHTML === "<p><br></p>") {
        toast.error("Title and content required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", contentHTML);
      if (image) formData.append("image", image);

      await axios.put(`http://localhost:5000/api/posts/${postId}`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post updated ✨");
      navigate(-1);
    } 
    catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  {loading && (
    <p className="pt-20 text-center">Loading...</p>
  )}
  // if (loading) {
  //   return <p className="pt-20 text-center">Loading...</p>;
  // }

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="mt-10 ml-64 px-8 py-10 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Edit your story...</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-2xl font-medium outline-none mb-4"
            />

            <div className="h-[55vh] overflow-y-auto">
              <div ref={editorRef} />
            </div>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => navigate(-1)} 
                className="border px-6 py-2 rounded-full hover:cursor-pointer"
              >
                Cancel
              </button>

              <button 
                onClick={handleUpdate} 
                disabled={loading}
                className={`px-6 py-2 rounded-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:cursor-pointer"}`}
              >
                Update
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center">
              <span>Add / Change image</span>
              <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </label>

            {(image || existingImage) && (
              <img
                src={image ? URL.createObjectURL(image) : existingImage?.startsWith("http") ? existingImage : `http://localhost:5000${existingImage}`}
                className="mt-4 rounded-lg max-h-48 object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBlog;
