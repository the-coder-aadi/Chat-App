import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },

    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },

    message:{
        type:String,
        default:""
    },

    fileUrl:{
        type:String,
        default:null
    },

    fileType:{
        type:String,
        default:null
    },

 replyTo: {
    text: String,
    file: String,
    fileType: String,
    from: String
},

    reactions:{
        type:[String],
        default:[]
    },

    edited:{
        type:Boolean,
        default:false
    },

    seen:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const Message = mongoose.model("messages", messageSchema)

export default Message