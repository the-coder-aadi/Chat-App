import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../config";
import LoadingScreen from "./loadingscreen";
function ProtectedRoute({children}) {
    const [loading, setloading] = useState(true)
    const [auth, setauth] = useState(false)
    const [minimumLoading, setMinimumLoading] = useState(true);
    useEffect(() => {
    const timer = setTimeout(() => {
        setMinimumLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
}, []);

    useEffect(()=>{
accesstokencheck()
    },[])

    async function accesstokencheck() {
        console.log("access token checking....");
        
        const token = localStorage.getItem("chat-token")
        try {
            const api = await fetch(`${API}/access-check`,{
                method:"POST",
                 headers:{
                    "Content-Type":"application/json",
                    "authorization":token
                 }
            })
            const res = await api.json()
            console.log(res);
            if (res.success) {
                setauth(true)
                setloading(false)
                return;
            }
            else{
                localStorage.removeItem("chat-token")
console.log("refresh token ko call karna hoga");
refreshtokencheck()
return;

            }
        } catch (error) {
            console.log(error, "error in access token checking");
             setloading(false);
    setauth(false);
            
        }
    }

    async function refreshtokencheck() {
          console.log("refresh token checking....");
        try {
            const api = await fetch(`${API}/refresh-check`,{
                method:"POST",
                credentials:"include"
            })
            const res = await api.json()
            console.log(res);
            if (res.success) {
                localStorage.setItem("chat-token", res.token)
                accesstokencheck()
                return
            }
            else{
                setloading(false)
setauth(false)
return;
            }
        } catch (error) {
            console.log(error, "error in refresh token checking...");
             setloading(false);
    setauth(false);
            
        }
    }
  if (loading || minimumLoading) {
    return <LoadingScreen />;
}
    if (!auth) {
        return <Navigate to="/" />
    }
    return children
}
export default ProtectedRoute