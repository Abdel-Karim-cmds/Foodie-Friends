const admin = require('firebase-admin')

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const Authentication = require('firebase/auth')
const Initialize = require('firebase/app')

const db = admin.firestore()

const firebaseConfig = {
    apiKey: "AIzaSyBXkDNN8xnO5m5OfcUE1hkisej1xQn8cD4",
    authDomain: "foodie-friends-26f3f.firebaseapp.com",
    projectId: "foodie-friends-26f3f",
    storageBucket: "foodie-friends-26f3f.appspot.com",
    messagingSenderId: "146330827008",
    appId: "1:146330827008:web:55c982392d29f09d3d5be5",
    measurementId: "G-54719JC13Y"
};

// Initialize Firebase
const firebase =Initialize.initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = Authentication.getAuth(firebase);


const express = require('express')
const port = 3001
const app = express()
const bodyparser = require("body-parser");
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ entended: false }))
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const filestore = require("session-file-store")(sessions)

app.set('views','views')
app.set('view engine', 'hbs');
app.use(express.static('public'))

const oneDay = 1000 * 60 * 60 * 24;

// cookie parser middleware
app.use(cookieParser());

var fileStoreOptions = {
    path:"./sessions/"
};

//session middleware
app.use(sessions({
    name:"Sessioonnnnn",
    secret: "8Ge2xLWOImX2HP7R1jVy9AmIT0ZN68oSH4QXIyRZyVqtcl4z1I",
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false,
    store: new filestore({logFn: function(){}}),
    path:"./sessions/"
}));

var restaurant_info;
var session;

app.get('/', (request,response) =>{
    session = request.session;
    if(session.customer){
        return response.render('home')
    }
    if(session.business){
        return response.redirect('/business-profile')
    }
    return response.render('home')
})
var errmessage;

app.get('/usersReg', (request,response) =>{
    response.render('Users',{message:errmessage})
})

app.get('/businessReg', (request,response) =>{
    response.render('Business')
})

app.get('/business-profile', (request,response) =>{
    if(session.user){
        return response.render('Business Profile')
    }
        return response.redirect('/businessReg')
})

app.get('/business-stats', (request,response) =>{
    response.render('business stats')    
})

app.get('/business-profile-info', async (request,response) =>{
    let docs = db.collection('Business').doc(session.user);
    let doc = await docs.get()
    response.send(doc._fieldsProto)
})

app.post('/signupB', async(request,response) =>{
    let exist = false;
    const checkBusiness = new Promise((resolve,reject) =>{
        db.collection("Business").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.data().Name == request.body.Bname){
                    return resolve(!exist)
                }
            });
            return reject(exist)
        });
    })

    checkBusiness.then(
        (value) =>{
            // console.log(value)
            console.log("The business already exists")
            return response.status(400).json({
                method: request.method,
                message: "Email or Business name already in use!"
            })
        },
        async (reason) =>{
            console.log(reason)
            try {
                const userResponse = await admin.auth().createUser({
                    email: request.body.Email,
                    password: request.body.Bpass,
                    emailVerified: true,
                    disabled: false
                });
                const userid = userResponse.uid
                let docRef = db.collection('Business').doc(userid);
                let doc = await docRef.get();
        
                await docRef.set({
                    'Email': request.body.Email,
                    'Name': request.body.Bname,
                    'Owner_firstname': request.body.OFName,
                    'Owner_lastname': request.body.OLName,
                    'Phone_number': '',
                    'Address': '',
                    'Description':''
                })

                return response.status(200).json({
                    method: request.method,
                    message: "Sucessful Business creation"
                })

            } catch (error) {
                console.log("Error wile inserting")
                console.log(error)

                return response.status(400).json({
                    method: request.method,
                    message: "Email or Business name already in use!"
                })
            }

        }
    )
})

app.post('/signupC', async(request,response) =>{
    try {
        const userResponse = await admin.auth().createUser({
            email: request.body.uEmail,
            password: request.body.uPass,
            emailVerified: true,
            disabled: false
        });
        const userid = userResponse.uid

        let docRef = db.collection('Customers').doc(userid);
        let doc = await docRef.get();

        await docRef.set({
            'Email': request.body.uEmail,
            'First_Name': request.body.Fname,
            'Last_Name': request.body.Lname
        })

        return response.status(200).json({
            method: request.method,
            message: "User Sucessfully created"
        })

    } catch (error) {
        console.log("Error wile inserting")
        console.log(error)
        return response.status(400).json({
            method: request.method,
            message: "Email already in use!"
        })
    }
})

app.get('/logged',(request,response) =>{
    session = request.session
    if(session.user)
        response.send(true)
    else
        response.send(false)
})

app.get('/loggedUser',(request,respone) =>{
    respone.send(session.user)
})

app.post('/loginC',(request,response) =>{
    let email = request.body.customerEmail
    let password = request.body.CustomerPassword
    let auths = Authentication.getAuth();
    Authentication.signInWithEmailAndPassword(auths, email, password)
    .then((userCredential) =>{
        //Signed in
        const user = userCredential.user;
        db.collection('Customers').doc(user.uid).get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                session = request.session
                session.user = user.uid;
                session.customer = 'Customer'
                session.email = email
                session.save()
                response.redirect('/')
            }
            else{
                Authentication.signOut(Authentication.getAuth()).then(() => {
                errmessage = 'Incorrect Credentials'
                response.redirect('/usersReg')
                }).catch((error) =>{
                    console.log("Error while signing you out")
                    console.log(error)
                })
            }
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("There was an error")
        console.log(errorMessage)
        console.log(error)
        errmessage = 'Incorrect Credentials'
        response.redirect('/usersReg')

    });
})

app.post('/loginB',(request,response) =>{
    let email = request.body.userBusinessEmail
    let password = request.body.userBusinessPassword
    let auths = Authentication.getAuth();
    
    Authentication.signInWithEmailAndPassword(auths, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        db.collection('Business').doc(user.uid).get()
        .then((docSnapshot) =>{
            if(docSnapshot.exists){
                session = request.session
                session.user = user.uid;
                session.business = 'Business'
                session.email = email
                session.save()
                response.redirect('/business-profile')
            }
            else{
                Authentication.signOut(Authentication.getAuth()).then(() => {
                errmessage = 'Incorrect Credentials'
                response.redirect('/businessReg')
                }).catch((error) =>{
                    console.log("Error while signing you out")
                    console.log(error)
                })

            }
        })
       
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("There was an error")
        console.log(errorMessage)
        console.log(error)
        errmessage = 'Incorrect Credentials'
        response.redirect('/businessReg')
    })
})

app.get('/logout', (request,response) =>{
    console.log(request.session)
    errmessage = ''
    Authentication.signOut(Authentication.getAuth()).then(() => {
        // Sign-out successful.
        session = request.session
        session.destroy((err) =>{
            session = null;
            if(err) throw err;
            response.redirect('/')
        })
        }).catch((error) => {
        console.log("Error for firebase sign out")
        console.log(error)
      });
})

app.post('/changeInfo', async(request,response) =>{
    try{
        let docRef = db.collection('Business').doc(session.user);
        await docRef.update({            
            'Phone_number': request.body.Phone,
            'Address': request.body.Address,
            'Description': request.body.Description
        })

        return response.status(200).json({
            method: request.method,
            message: "Business Inserted Successfully",
        })
    }
    catch(err){
        console.log(err)
    }
})

app.get('/restaurants', async(request,response) =>{
    let allBusinesses = []
    db.collection("Business").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            allBusinesses.push(doc.data())
        });
        response.send(allBusinesses)
    });
})

app.post('/showcase',(request,response) =>{
    let restaurant_name = request.body.rest_name;
    db.collection("Business").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(doc.data().Name == restaurant_name){
                restaurant_info = doc.data()
            }
        });
    });
    
})

app.get('/business-info',(request,response) =>{
    response.render('Information Page')
})

app.get('/business-details',(request,response) =>{
    response.send(restaurant_info)
})

// Generate the secret key used for the session encryption
function generate(){
    let lower_case = 'abcdefghijklmnopqrstuvwxyz'
    let uppuer_case = lower_case.toUpperCase()
    let numbers = '0123456789'
    let sec = lower_case + uppuer_case + numbers
    let result = [];
    for ( let i = 0; i < 30; i++ ) {
        result.push(sec.charAt(Math.floor(Math.random() * sec.length)));
    }
    let secretkey = result.join("").toString()
    return secretkey
}

app.post('/submit-review',async (request,response) =>{

    try {
        let information = request.body
        let infos = []
        infos = [information.review_giver,information.star_given,information.review_given,session.email,new Date().toLocaleDateString()]
        let key = generate()
        console.log(key)
        let docRef = db.collection('Reviews').doc(key);
        let doc = await docRef.get();

        await docRef.set({
            Name: information.business,
            review: infos
        })

        return response.status(200).json({
            method:request.method,
            message: "Thank you for the review"
        })

    } catch (error) {
        console.log(error)
    }

})

var bName;
app.post('/set-name',(request,response) =>{
    bName = request.body.business_name;
})

app.get('/get-reviews',async(request, response) =>{
    let allreviews = []
    db.collection("Reviews").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(doc.data().Name == bName){
                allreviews.push(doc.data())
            }
        });
        response.send(allreviews)
    });
})

app.get('/get-username', async(request,response) =>{
    let uid = session.user
    
    db.collection("Customers").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(doc.id == uid)
                response.send(doc.data().Last_Name)
        });
    });
})

app.listen(port, () =>{console.log(`Server is listening on port ${port}`)})