const express = require ("express")
const http = require ("http")
const socketIo = require ("socket.io")
const path = require ("path") //para las vistas
const {Server} = require("socket.io")  //Es el server propio de webSocket, se creara a partir del server http
                                    //le pido solo que me importe la clase Server de la libreria socket.io, solo eso vamos a usar
const handlebars = require ("express-handlebars")


const app=express()
const server = http.createServer(app)
const io = new Server(server)



//Configuracion handlebars
app.engine("handlebars", handlebars.engine()) //indica que motor de plantilla vamos a instanciar

//Carpeta views para las vistas
app.set("views", __dirname + "/views")

//Indico que uso handlebars como motor de plantilla, que lo instancie mas arriba
app.set("view engine", "handlebars")

//usa los archivos dentro de la carpeta views
app.use(express.static(path.join(__dirname, "/views")))

//usa los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "/public")))



//Ruta principal
app.get("/", (req, res)=>{ 
    res.render("index.hbs")
})


const users = {}

//socket.io
//vamos a tener 3 tipos de eventos, cuando un usuario se conecta, cuando escribe en el chat y cuando de desconecta
io.on("connection", (socket)=>{
    console.log("un usuario de ha conectado")
    socket.on("newUser", (username)=>{
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    //el usuario emite un mensaje
    socket.on("chatMessage", (message)=>{
        const username = users[socket.id]
        io.emit("message", {username, message})
    })

    //El usuario se desconecta
    socket.on("disconnect", ()=>{
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("userDisconnected", username)
    })
})
 

//Creamos server

const PORT = 8080
server.listen(PORT, ()=>console.log(`servidor corriendo en puerto ${PORT}`))

