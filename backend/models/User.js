import mongoose from 'mongoose';

//create a schema
const userSchema=new mongoose.Schema(
    //all the schema fields:
    {   
        fullName:{
            //properties of the field:
            type: String,
            required: true,
            trim: true,   //remove extra spaces at start & end 
        },
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password:{
            type: String,
            select: false,   //exclude password field in queries & responses 
            required: function(){
                return this.authProvider==="email"  //if the current document's authProvider returns true for email
            },
        },
        googleId:{    //optional
            type: String,
        },
        authProvider:{
            type: String,
            enum: ["email","google"],   //enumeration- mongoose will only allow to store one from this set of valid options, nothing else
            default: "email",   //when creating a user, if we don't explicitly give a value for authProvider- mongoose stores "email" as default 
        },

        profilePic:{
            type: String,
            default: "",
        },
        bio:{
            type: String,
            maxLength: 200,
        },
        socialLinks:{
            gmail: String,
            spotify: String,
            facebook: String,
            instagram: String,
            x: String,
            github: String,
            website: String,
        },

        followers:[   //array storing object ids of all users that follow this user
            //each item in the array stores type & ref 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        following:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        likedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    }, {timestamps: true}
);

//create a mongoose model named 'User' where 'userSchema' is the structure of the collection (schema) 
export default mongoose.model('User',userSchema);
