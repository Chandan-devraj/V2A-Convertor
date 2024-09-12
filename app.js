//required packages
const express =require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//create the express server

const app = express();

//server port number
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine","ejs");
app.use(express.static("public"));

//needed to parse html data POST request
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' 'unsafe-eval'; object-src 'none';"
    );
    next();
});



app.get("/",(req,res)=>{
    res.render("index");
})

app.post("/convert-mp3",async (req,res)=>{
    app.post("/convert-mp3", async (req, res) => {
        try {
            console.log("POST /convert-mp3 route hit"); // Log to verify route is accessed
            const videoID = req.body.videoID;
            console.log("Video ID:", videoID); // Log the video ID received
    
            const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": process.env.API_KEY,
                    "x-rapidapi-host": process.env.API_HOST,
                },
            });
    
            const fetchResponse = await fetchAPI.json();
            console.log(fetchResponse); // Log the API response
    
            if (fetchResponse.status === "OK") {
                return res.render("index", { success: true, song_title: fetchResponse.title, song_link: fetchResponse.link });
            } else {
                return res.render("index", { success: false, message: fetchResponse.msg });
            }
        } catch (error) {
            console.error("Error:", error); // Log any errors
            return res.render("index", { success: false, message: "An error occurred." });
        }
    });
    
})
//start the server
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})