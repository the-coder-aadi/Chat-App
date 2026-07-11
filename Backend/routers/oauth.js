import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
const authrouter = express.Router()
authrouter.get("/auth/google", passport.authenticate("google",
    {scope:["email", "profile"]}
))

authrouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  (req, res) => {

    console.log(req.user);

    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.name
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "10d" }
    );

   res.cookie("refresh-token", token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",

    maxAge: 10 * 24 * 60 * 60 * 1000
})

res.redirect(
`${process.env.CLIENT_URL}/home?username=${encodeURIComponent(req.user.name)}
&userid=${req.user._id}`
);
  }
);

export default authrouter
