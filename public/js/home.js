async function getRestaurants() {
    let response = await fetch('/restaurants',{method:"GET"})
    let data = JSON.parse( await response.text())
    console.log(data)
    // console.log(typeof data)
    // data.sort((a,b) = {
    //     return
    // })
    populatePage(data)
}

function populatePage(businesses){
    let block = document.getElementById('bussiness-informations')
    businesses.forEach(business => {
        delete business.Owner_firstname;
        delete business.Owner_lastname;
        
        let div = document.createElement('div')
        div.classList = 'col-lg-4'
        let h2 = document.createElement('h2')
        let business_name = document.createTextNode(business.Name)
        let ul = document.createElement('ul')
        ul.classList = 'list-group'
        let userInfo = []
        Object.keys(business).forEach(function(key) {
            userInfo.push(key)
        })
        userInfo.sort()

        for (let index = 0; index < userInfo.length; index++) {
            let row = document.createElement('li')
            row.classList = 'list-group-item'      
            row.appendChild(document.createTextNode(`${userInfo[index].replace("_"," ")}: ${business[userInfo[index]]} `))  
            ul.appendChild(row)    
        }
        let p = document.createElement('p')
        let a = document.createElement('a')
        a.classList = 'btn btn-secondary'
        a.href = '/business-info'
        a.setAttribute('role','button')
        a.innerHTML = 'View details &raquo;'
        a.setAttribute('onclick','showcase(this)')

        p.appendChild(a)
        h2.appendChild(business_name)
        div.appendChild(h2)
        div.appendChild(ul)
        div.appendChild(p)
        block.appendChild(div)
    });
}

function isLoggeIn(){
    // if(sessionStorage)
    console.log(sessionStorage.getItem('status'))
}

async function showcase(element){
    // console.log(element.parent)
    let elt = element.parentNode.parentNode
    let name = elt.children
    console.log(elt)
    console.log(name[0].innerText)
    const restaurant = name[0].innerText

    const url = '/showcase'
    const rest ={
        rest_name: restaurant
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
    };
    const response = await fetch(url, options);

}

async function islogged(){
    let response = await fetch('/logged', {method:'GET'})
    let data = await response.text()
    console.log(data)
    if(data == 'true'){
        document.getElementById('loginbtn').style.display = 'none'
        document.getElementById('signoutbtn').style.display = 'block'
        getusername()
    }
    else{
        document.getElementById('loginbtn').style.display = 'block'
        document.getElementById('signoutbtn').style.display = 'none'
    }
    getRestaurants();
}

document.getElementById('signoutbtn').onclick = () =>{
    location.reload()
}

async function getusername(){
    let response = await fetch('/get-username',{method:'GET'});
    let data = await response.text()
    console.log(data)
    document.getElementById('lastname').innerText = `Welcome, ${data}`
}