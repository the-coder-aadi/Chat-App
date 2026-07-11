import mongoose from "mongoose"

const notificationschema = new mongoose.Schema({
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    type:{
        type:String
    },
    text:{
        type:String
    },
    count: {
    type: Number,
    default: 1
},
    read: {
  type: Boolean,
  default: false
},
    seen:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const notificationmodel = mongoose.model("notification",notificationschema)

export default notificationmodel