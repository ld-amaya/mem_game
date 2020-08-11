//Set veriables
const card = document.querySelector('.cards');
const easyGame = document.querySelector('#easy');
const mediumGame = document.querySelector('#medium');
const difficultGame = document.querySelector('#difficult');
let highScore = document.querySelector('#highScore');
let body  = document.querySelector('.container');
let title = document.querySelector('#header_menu');
let score = document.querySelector('#score');

//Set global variables
let card1='';
let card2='';
let counter=0;
let totalScore = 0;
let scoreCounter = 10;
let cardCounter =0;
let numCards = 10;

setGame();
title.innerText = 'Memory Game - Medium Level';
easyGame.addEventListener('click',(e)=> {
    numCards =4;
    setGame();
    title.innerText = 'Memory Game - Easy Level';
})
mediumGame.addEventListener('click',(e)=> {
    numCards = 10;
    setGame();
    title.innerText = 'Memory Game - Medium Level';
})
difficultGame.addEventListener('click',(e)=> {
    numCards =20;
    setGame();
    title.innerText = 'Memory Game - Difficult Level';
})

if(card) card.addEventListener('click', (e)=>{
    card2 = e.target; //assign selected card to card 2
    if ((!e.detail || e.detail === 1) && !card2.classList.contains('cards') && !card2.dataset.isOpen){ //only allow first click from the user
        card2.style.backgroundColor = newColors[e.target.dataset.id]; //assign background color based on the newColors array
        if (!card2.classList.contains('rotate')) card2.classList.toggle('rotate'); //rotate the card
        if (counter === 0){
            card1 = e.target;  //assign selected card as card1 for new pair selection
            counter ++; //increase counter
        } else {
            if(card1!=card2){ //check if cards are clicked 2
                cardCompare();
                // initialize variables
                counter =0;
                card1='';
            }
        }
    }
});

function setGame(){
    let setCards = '';
    card.innerHTML='';
    for (let i = 0;i<numCards;i++){
        let myDiv = document.createElement('div');
        if (numCards===4)  { myDiv.classList.toggle('cardEasy');}
        if (numCards===10) { myDiv.classList.toggle('cardMedium');}
        if (numCards===20) { myDiv.classList.toggle('cardDifficult');}
        myDiv.classList.toggle('card');
        myDiv.id = `card${i+1}`;
        myDiv.dataset.id = i;
        card.append(myDiv);
    }
    cardColorInit(); // initialize random colors during page load
}

function cardColorInit(){
    //Reset the scores
    totalScore = 0;
    scoreCounter = 10;
    score.textContent = 0;
    let cards = document.querySelectorAll('.card');
    let initColor = [];    //use array to store colors;
    for (myCard of cards){
        myCard.classList.add('isClose'); //set color to black with class isClose
        if (myCard.classList.contains('rotate')) myCard.classList.toggle('rotate') // remove class rotate
        myCard.style.removeProperty('background-color'); //remove background property
        delete myCard.dataset.isOpen; //delete any isOpen dataset
    }
    for (let i=0;i<(cards.length/2);i++){ 
        //select random rgb colors
        let red = Math.floor(Math.random() * 266);
        let green = Math.floor(Math.random() * 266);
        let blue = Math.floor(Math.random() * 266);
        initColor.push(`RGB(${red},${green},${blue})`); //push array twice
        initColor.push(`RGB(${red},${green},${blue})`); //push array twice
    }
    newColors = shuffle(initColor); //shuffle colors and assign to a variable
    if (body.classList.contains('myBody')) body.classList.remove('myBody'); // remove confetti background
    if (localStorage.getItem('highScore')) highScore.textContent = localStorage.getItem('highScore'); //dispaly current highscore
    
}

function shuffle(a){ 
    //shuffle data inside array
    for (let i=0;i<a.length;i++){
        const x = Math.floor(Math.random() * (i+1));
        [a[i],a[x]] =[a[x],a[i]];
    }
    return a;
}

function cardCompare(){
    let cards = document.querySelectorAll('.card');
    const oldCard = card1.style.backgroundColor; //assign card color to variable
    const newCard = card2.style.backgroundColor; //assign card color to variable
    if (oldCard === newCard) {
        //add dataset isOpen if cards matched
        card1.dataset.isOpen = 'yes';
        card2.dataset.isOpen ='yes';
        card1.classList.remove('isClose'); //remove isClose property
        card2.classList.remove('isClose'); //remove isClose property
        totalScore += scoreCounter; //add score to the total score
        score.textContent = totalScore; //display score to user
        scoreCounter = 10; //reset score counter
        cardCounter +=2;
        if (numCards === 4 && cardCounter === numCards) gameDone();
        if (numCards === 10 && cardCounter === numCards) gameDone();
        if (numCards === 20 && cardCounter === numCards) gameDone(); 
    
    } else {
        //hide cards after 1sec if card does not  match
        scoreCounter --;
        setTimeout(()=>{
            for (myCard of cards){
                if (!myCard.dataset.isOpen){
                    myCard.style.backgroundColor='RGB(0,0,0)';  //set cards back to black
                    if (myCard.classList.contains('rotate')) myCard.classList.toggle('rotate') // remove class rotate
                }
            }
        },1500); //set time out to 1second
    }
}

function gameDone(){
    body.classList.add('myBody');
    cardCounter = 0;
    let iScore = localStorage.getItem('highScore')
    if (iScore < totalScore) {
        localStorage.setItem('highScore', totalScore); 
        highScore.textContent = totalScore;
    }
}