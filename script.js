import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue } from
    "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrnrxwL4CxTmuItcAq-E9Nqtgt8ZS40x4",
    authDomain: "to-do-list-409ef.firebaseapp.com",
    databaseURL: "https://to-do-list-409ef-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "to-do-list-409ef",
    storageBucket: "to-do-list-409ef.appspot.com",
    messagingSenderId: "493721823886",
    appId: "1:493721823886:web:78cd7edc70ea17f48177df",
    measurementId: "G-8570T7W35S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let userName = $("#userName")
let pass = $("#pass")

let btn = $("#btn")
let send = $("#send")

let usersArray = [];
let passArray = [];

let user;

const starCountRef = ref(database, 'messages/');
onValue(starCountRef, (snapshot) => {
    snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        const key = childSnapshot.key;
        console.log(data.mess)
        console.log(data.user)
    });

});

const starCountRef1 = ref(database, 'users/');
onValue(starCountRef1, (snapshot) => {
    snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        const key = childSnapshot.key;
        console.log(data.name)
        console.log(data.pass)
        usersArray.push(data.name)
        passArray.push(data.pass) // милиця, виправити на асоціативний масив, якщо звятиться сенс
    });

});


function ifUserExists() {
    if (!usersArray.includes(userName.val())) {
        alert("Signed Up!");
        set(ref(database, 'users/' + userName.val()), {
            name: userName.val(),
            pass: pass.val(),
        })
    } else {
        if (passArray.includes(pass.val())) {
            alert("Logged In!")
            user = userName.val();

            $('#messages').css('display', 'block')
        } else {
            alert("User is already exist!")
        }
    }
}

function read() {
    return new Promise((resolve, reject) => {
        const starCountRef1 = ref(database, 'users/');
        onValue(starCountRef1, (snapshot) => {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                const key = childSnapshot.key;
                usersArray.push(data.name)
                passArray.push(data.pass) // милиця, виправити на асоціативний масив, якщо звятиться сенс
            });

        });
    })
}
btn.click(function () {
    read()
        .then(ifUserExists())
        .catch(err => console.log(err));
});

send.click(function () {
    set(ref(database, 'messages/' + push(child(ref(database), 'messages/')).key), {
        mess: $('#message').val(),
        user: user
    })
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    p1.classList.add('p1');
    p2.classList.add('p2');
    p1.innerHTML = user;
    p2.innerHTML = $('#message').val();
    p1.style.color = 'rgb(' + (Math.random() * 255) + ',' + (Math.random() * 255) + ',' + (Math.random() * 255) + ')'
    document.getElementById("messArea").appendChild(p1);
    document.getElementById("messArea").appendChild(p2);
})