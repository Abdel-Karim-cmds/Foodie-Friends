
var one = 0;
var two = 0;
var three = 0;
var four = 0;
var five = 0;
var number_of_reviews = 0;

async function getSession(){
    let response = await fetch('/business-profile-info',{method:"GET"})
    let data = await response.text()
    let info = JSON.parse(data)
    document.getElementById('business-name').innerText = info.Name.stringValue
    sendBusinessName(info.Name.stringValue)
    getBusinessReviews()

}

async function sendBusinessName(bName){
    const url = '/set-name'
    const name = {
        business_name:bName
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
    data = data.sort()
    let reviews =[]
    
    data.forEach(item =>{
        reviews.push(item.review)
    })

    number_of_reviews = reviews.length;
    populateReviews(reviews)
    count(reviews)    
}

function populateReviews(reviews){
    let table = document.getElementById('table')
    reviews.forEach(review => {
        var row = document.createElement('tr');
        var dataID = document.createElement('td')
        var textID = document.createTextNode(review[0])
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
        var dataReply = document.createElement('td')
        var textReply = review[3]
        var a = document.createElement('a')
        a.innerText = 'reply'
        a.setAttribute('href','mailto:'+textReply+`?subject=Your review "${review[2]}" about ${document.getElementById('business-name').innerText} on the ${review[4]}&body=Dear Mr,${review[0]} `)
        dataReply.appendChild(a)
        row.appendChild(dataID)
        row.appendChild(dataReview)
        row.appendChild(dataStar)
        row.appendChild(dataDate)
        row.appendChild(dataReply)
        table.appendChild(row)
    });
}

function count(array){
    array.forEach(element => {
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

    let graphValue = [one,two,three,four,five]
    
    // Creating variable to store the sum
    var sum = 0;
  
    // Running the for loop
    for (let i = 0; i < graphValue.length; i++) {
        sum += graphValue[i];
    }
    if(sum != 0)
        plotGraph(graphValue)
    else
        document.getElementById('canvas').innerHTML = '<p>Nothing to see here</p>'

    let total = (one + two*2 + three*3 + four*4 + five*5)/number_of_reviews;
    total = total.toFixed(2);

    document.getElementById('star-one').innerText = one;
    document.getElementById('star-1').innerText = one;
    document.getElementById('star-two').innerText = two;
    document.getElementById('star-2').innerText = two;
    document.getElementById('star-three').innerText = three;
    document.getElementById('star-3').innerText = three;
    document.getElementById('star-four').innerText = four;
    document.getElementById('star-4').innerText = four;
    document.getElementById('star-five').innerText = five;
    document.getElementById('star-5').innerText = five;
    if(isNaN(total))
        document.getElementById('total').innerHTML = `Oops!`;
    else
        document.getElementById('total').innerHTML = `${total}`;
}

var body = document.getElementById('background');
var tilted = false;
var toggleTilt = function () {
    tilted = !tilted;
    if (tilted)
        {
            body.classList.add('details');            
            document.getElementById('bar1').style.height = `${one}0px`
            document.getElementById('bar2').style.height = `${two}0px`
            document.getElementById('bar3').style.height = `${three}0px`
            document.getElementById('bar4').style.height = `${four}0px`
            document.getElementById('bar5').style.height = `${five}0px`
        }
    else
        {
            body.classList.remove('details');
            
    document.getElementById('bar1').style.height = `0px`
    document.getElementById('bar2').style.height = `0px`
    document.getElementById('bar3').style.height = `0px`
    document.getElementById('bar4').style.height = `0px`
    document.getElementById('bar5').style.height = `0px`
        }
};
body.addEventListener('click', toggleTilt);
body.addEventListener('touchstart', toggleTilt);
if (location.pathname.match(/fullcpgrid/i))
    setTimeout(toggleTilt, 1000);

function plotGraph(summed){
    
    var barColors = ["black", "red", "blue", "purple", "gold"];
    var ch = new Chart("cht", {
        type: "pie",
        data: {
            labels: ["1 star", "2 star", "3 star", "4 star", "5 star"],
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: barColors,
                borderColor: barColors,
                borderWidth: 4,
                // pointBackgroundColor: colors,
                data: summed,
            }, ],
        },
        options: {
            legend: { display: true },
            /*
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                },


                            }, ],
                        },
            */
        },
    });
}