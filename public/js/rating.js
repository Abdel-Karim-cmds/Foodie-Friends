var user;
var username;
var business_details;
var number_of_reviews;
let star1 = document.getElementById('rate-1')
let star2 = document.getElementById('rate-2')
let star3 = document.getElementById('rate-3')
let star4 = document.getElementById('rate-4')
let star5 = document.getElementById('rate-5')

let feeling = document.getElementById('feeling')

star1.onclick = () =>{
    feeling.innerText = 'I did not like it'
}

star2.onclick = () =>{
    feeling.innerText = 'I have seen better'
}

star3.onclick = () =>{
    feeling.innerText = 'It was not that bad'
}

star4.onclick = () =>{
    feeling.innerText = 'Just one thing was lacking'
}

star5.onclick = () =>{
    feeling.innerText = 'It was amazing'
}

let ratingCheck = document.getElementById('agreeRating')

ratingCheck.onchange = () =>{
    if(ratingCheck.checked){
        // document.getElementById('submitRating').setAttribute('disabled','false')
        document.getElementById('submitRating').removeAttribute('disabled')
    }
    else{
        document.getElementById('submitRating').setAttribute('disabled','true')
    }
}

async function getDetails(){
    islogged()
    let response = await fetch('/business-details',{method:"GET"})
    let data = await response.text()
    // console.log(data)
    business_details = JSON.parse(data)
    // console.log(business_details)
    populateDetails(business_details)
    sendBusinessName()
    getBusinessReviews()
}

function populateDetails(details){
    document.getElementById('name').innerText = details.Name;
    document.getElementById('placeName').innerText = details.Name;
    // console.log(details.Phone_number)
    document.getElementById('address').innerText = details.Address;
    document.getElementById('phone').innerText = details.Phone_number;
    document.getElementById('email').innerText = details.Email;
    document.getElementById('description').innerText = details.Description;

}

async function veriflogged(){
    let response = await fetch('/logged', {method:'GET'})
    let data = await response.text()
    // console.log(data)
    if(data == 'false'){
        window.location.href = '/usersReg'
        return false
    }
    else{
        return true
    }
}


function display(message){
    let err = document.querySelector('.pop-up')
    err.classList.toggle('hide')
    let Message = document.querySelector('.message')
    Message.innerText = message
}

let form = document.querySelector('#reviewForm')

async function submitForm(){
    let radios = document.querySelectorAll('input[name="rate"]')
    let textarea = document.getElementById('reviewbox').value;
    
    const url = '/submit-review'
    let selected;
    for(const radio of radios){
        if(radio.checked){
            selected =  radio.value;
            break;
        }
    }
    console.error(selected)

    if(!selected){
        return alert("Please select a star")
    }
    console.error(selected)
    const review = {
        business: business_details.Name,
        review_giver: reviewer,
        star_given : parseInt(selected),
        review_given: textarea,
        date: new Date().getDate()
    }
    // console.log(review)
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
    };
    const response = await fetch(url, options);
    const outcome = await response.json();

    if(response.status == 200){
        form.reset()
        feeling.innerText = ""
        alert(outcome.message)
        location.reload()
    }
}

async function getLoggedUser(){
    let response = await fetch('/loggedUser', {method:'GET'})
    user = await response.text()
    // console.log(user)
}

form.addEventListener('submit',async (e) =>{
    getLoggedUser()
    e.preventDefault();
    // if(await veriflogged()){
        submitForm()
    // }
})


async function sendBusinessName(){
    const url = '/set-name'
    // console.log(business_details.Name)
    const name = {
        business_name:business_details.Name
    }
    const options = {
        method:'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(name)
    }
    const response = await fetch(url,options)
}

async function getBusinessReviews (){
    let response = await fetch('/get-reviews',{method:'GET'})
    let data = JSON.parse( await response.text())
    // console.log(data)
    data = data.sort()
    let reviews =[]
    
    data.forEach(item =>{
        reviews.push(item.review)
    })
    count(reviews)
    // number_of_reviews = reviews.length;
    // console.log(number_of_reviews)
    populateReviews(reviews)
}

function populateReviews(reviews){
    let table = document.getElementById('table')
    reviews.forEach(review => {
        var row = document.createElement('tr');
        var dataID = document.createElement('td')
        var textID = document.createTextNode(`${review[0]}`)
        dataID.appendChild(textID)
        var dataReview = document.createElement('td')
        var textReview = document.createTextNode(review[2])
        dataReview.appendChild(textReview)
        var dataStar = document.createElement('td')
        var textStar = document.createTextNode(review[1])
        dataStar.appendChild(textStar)
        var dataDate = document.createElement('td')
        var textDate = document.createTextNode(review[4])
        dataDate.appendChild(textDate)
        row.appendChild(dataID)
        row.appendChild(dataReview)
        row.appendChild(dataStar)
        row.appendChild(dataDate)
        table.appendChild(row)
    });
}


async function islogged(){
    let response = await fetch('/logged', {method:'GET'})
    let data = await response.text()
    // console.log(data)
    if(data == 'true'){
        document.getElementById('loginbtn').style.display = 'none'
        document.getElementById('signoutbtn').style.display = 'block'
        getusername()
    }
    else{
        document.getElementById('loginbtn').style.display = 'block'
        document.getElementById('signoutbtn').style.display = 'none'
    }
    // getRestaurants();
}

var reviewer;

async function getusername(){
    let response = await fetch('/get-username',{method:'GET'});
    let data = await response.text()
    // console.log(data)
    reviewer = data;
    document.getElementById('lastname').innerText = `Welcome, ${data}`
}


function count(array){
    // console.log("Thisssss")
    // console.log(array)
    number_of_reviews = array.length;
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    array.forEach(element => {
        // console.log(element)
        if((element[1]) == 1){
            one +=1
        }
        if((element[1]) == 2){
            two +=1
        }
        if((element[1]) == 3){
            three +=1
        }
        if((element[1]) == 4){
            four +=1
        }
        if((element[1]) == 5){
            five = five +1
        }
        // console.log(element[1])
    });

    let total = (one + two*2 + three*3 + four*4 + five*5)/number_of_reviews;
    // console.log("******************")
    // console.log(total)

    total = total.toFixed(2);

    let totalStars = total.toString();

    let stars1 = document.getElementById('final_star_1')
    let stars2 = document.getElementById('final_star_2')
    let stars3 = document.getElementById('final_star_3')
    let stars4 = document.getElementById('final_star_4')
    let stars5 = document.getElementById('final_star_5')
    
    let final_rating = totalStars.split("");
    // console.log(`final rating ${typeof final_rating}`)
    if((final_rating[0]==5) && (final_rating[2]==0)){ // Exactly 5
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star'
        stars4.classList = 'fa fa-star'
        stars5.classList = 'fa fa-star'
    }
    if((final_rating[0]==4) && (final_rating[2]>0)){ // 4.5
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star'
        stars4.classList = 'fa fa-star'
        stars5.classList = 'fa fa-star-half-full'
    }
    if((final_rating[0]==4) && (final_rating[2]==0)){ //Exactly 4
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star'
        stars4.classList = 'fa fa-star'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==3) && (final_rating[2]>0)){ // 3.5
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star'
        stars4.classList = 'fa fa-star-half-full'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==3) && (final_rating[2]==0)){ //Exactly 3
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star'
        stars4.classList = 'fa fa-star-o'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==2) && (final_rating[2]>0)){ //2.5
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star-half-full'
        stars4.classList = 'fa fa-star-o'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==2) && (final_rating[2]==0)){ //Exactly 2
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star'
        stars3.classList = 'fa fa-star-o'
        stars4.classList = 'fa fa-star-o'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==1) && (final_rating[2]>0)){ //1.5
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star-half-full'
        stars3.classList = 'fa fa-star-o'
        stars4.classList = 'fa fa-star-o'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==1) && (final_rating[2]==0)){ //Exactly 1
        stars1.classList = 'fa fa-star'
        stars2.classList = 'fa fa-star-o'
        stars3.classList = 'fa fa-star-o'
        stars4.classList = 'fa fa-star-o'
        stars5.classList = 'fa fa-star-o'
    }
    if((final_rating[0]==0) && (final_rating[2]>0)){ //0.5
        stars1.classList = 'fa fa-star-half-full'
        stars2.classList = 'fa fa-star-o'
        stars3.classList = 'fa fa-star-o'
        stars4.classList = 'fa fa-star-o'
        stars5.classList = 'fa fa-star-o'
    }

    if(isNaN(total))
        document.getElementById('stars').innerHTML = `Has not been reviewed yet`;
    else
        document.getElementById('stars').innerHTML = `${total}`;

}


document.getElementById('addreviewBTN').addEventListener('click',(e) =>{
    veriflogged()
})