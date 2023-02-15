// let emailCheck = document.getElementById('agreeEmail')
// emailCheck.onchange = () =>{
//     document.getElementById('changingEmail').classList.toggle('disabled')
// }
// let passwordCheck = document.getElementById('agreePassword')
// passwordCheck.onchange = () =>{
//     document.getElementById('changingPassword').classList.toggle('disabled')
// }
let infoCheck = document.getElementById('agreeInfo')

infoCheck.onchange = () =>{
    console.log("YO")
    // document.getElementById('changingInfo').classList.toggle('disabled')
    
    if(infoCheck.checked){
        // document.getElementById('submitRating').setAttribute('disabled','false')
        document.getElementById('changingInfo').removeAttribute('disabled')
    }
    else{
        document.getElementById('changingInfo').setAttribute('disabled','true')
    }
}

async function getProfileInfo(){
    let response = await fetch('/business-profile-info',{method:"GET"})
    let data = await response.text()
    // console.log(data)
    let info = JSON.parse(data)
    // console.log(info)
    document.getElementById('business-name').innerText = info.Name.stringValue
    populateList(info)
}

function populateList(array){
    let infoList = document.getElementById('information')
    let userInfo = []
    Object.keys(array).forEach(function(key) {
        userInfo.push(key)
    })
    // console.log(userInfo)
    userInfo.sort()
    // console.log(userInfo)
    for(let i =0;i<userInfo.length;i++){
        let row = document.createElement('li')
        row.classList = 'list-group-item'
        row.appendChild(document.createTextNode(`${userInfo[i].replace("_"," ")}: ${array[userInfo[i]].stringValue}`))
        infoList.appendChild(row)
    }
}


async function changingInfo(){
    // let fname = document.getElementById('fname').value
    // let lname = document.getElementById('lname').value
    // let bname = document.getElementById('bname').value
    let phone = document.getElementById('phone').value
    let address = document.getElementById('address').value
    let description = document.getElementById('description').value

    const url = '/changeInfo';

    const newInfo = {
        // Fname: fname,
        // Lname: lname,
        // Bname: bname,
        Phone: phone,
        Address: address,
        Description: description
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newInfo),
    };
    const response = await fetch(url, options);

    if(response.status == 200){
        location.reload();
    }
}

document.getElementById('newInfo').addEventListener('submit', (e) =>{
    e.preventDefault()
    changingInfo();
})
