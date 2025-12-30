# 📝 Blogora - Social Blogging Platform with AI-Assisted Content Generation
Blogora is a **full-stack blogging web application** where users can create, share, and engage with blog posts. It also includes an AI-assisted blog generation feature that helps users generate blog content based on a given title using the **Hugging Face API.**

The platform supports modern social blogging features such as following users, liking posts, bookmarking, and commenting, with **cloud-based image storage using Cloudinary.**

## 🚀 Live Demo
https://blogora-green.vercel.app/

## ✨ Key Features
**1. Authentication & User Management**
- User registration and login
- JWT-based authentication
- Follow / Unfollow users
- Profile page with:
  - User details
  - Followers & following
  - User’s blog posts

**2. Blogging Features**
- Create blog posts with:
  - Title, subtitle, content
  - Optional cover image upload
- View all blogs on the homepage
- Like and unlike posts
- Comment on blog posts
- Bookmark posts for later reading

**3. AI-Assisted Blog Generation**
- Generate blog content by providing a title
- Integrated with Hugging Face text generation models
- Helps users with writer’s block and faster content creation

**4.  Image Upload**
- Blog cover images uploaded and stored using Cloudinary
- Secure and scalable cloud-based image hosting
- Image URLs stored in the database instead of local file paths

## 🛠 Tech Stack
- **Frontend:**
  - React.js
  - React Router
  - Axios
  - Tailwind CSS
  - Lucide Icons

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Multer
  - Cloudinary SDK

- **AI Integration:**
  - Hugging Face API (Text Generation)

## ⚙️ Installation & Setup
**1. Clone the repository**
```
git clone https://github.com/ishitadutta1306/Blogora.git
cd Blogora
```

**2. Install dependencies**
- **Backend**

```
cd backend
npm install
```

- **Frontend**
```
cd frontend
npm install
```

**3. Environment Variables**

Create a .env file inside the server folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

HF_API_KEY=your_huggingface_api_key
```

**4. Run the application**
- **Backend**
```
cd backend
npm run dev
```
- **Frontend**
```
cd frontend
npm run dev
```
