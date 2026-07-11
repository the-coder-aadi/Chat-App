import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import usermodel from "../models/usermodel.js";
passport.use(new GoogleStrategy(
{clientID: process.env.google_client_id,
clientSecret:process.env.google_client_secret,
callbackURL: process.env.google_callback_url
},
async (accesstoken, refreshtoken, profile, done)=>{
    try {
 const email = profile.emails[0].value
 let exist = await usermodel.findOne({email})
 if (!exist) {
    exist = await usermodel.create({
        name:profile.displayName,
        email,
        googleid: profile.id,
        provider: "google"
    }
)
 }
 else if (!exist.googleid) {
    exist.name = profile.displayName
     exist.googleid = profile.id;
      exist.provider = "google"
      await exist.save()
 }
     done(null, exist)
             
    } catch (error) {
        done(error, null)
    }
}

))
export default passport