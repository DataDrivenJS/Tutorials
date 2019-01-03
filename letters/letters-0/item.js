/*
    retrieves the letterID from URL which will be used to 
    show the letter. It can also be used for tracking.
*/

function getLetterID(){
    var id;
    var letterParam = window.location.search.split('letter=');
    if (letterParam[1] && letterParam[1]!=''){
        id = letterParam[1].split('&')[0];
    }
    return id;
}

/*  
    shows the main letter based on its ID
*/

function setTheMainLetter (id) {
    var itemsList = document.querySelector('.content .items');
    addLetter (id, itemsList);
    setTimeout(function(){itemsList.classList.remove('initial');},300);
}

/* 
    inserts any letter into the list, this could be used 
    to show other letters, not just the main one 
*/

function addLetter( id, itemsList ){
    var letter = id.split('-');
    var item = document.createElement('div');
    item.innerHTML = '<span>'+letter.shift()+'</span>';
    item.className = letter.join(' ');
    itemsList.appendChild(item);
}


/* 
    enable the back button 
*/

document.querySelector('.backBtn').addEventListener('click',function(e){
    window.location.href = './list.html';
    e.preventDefault();
});

/* 
    set up the page
*/

var letterID = getLetterID();
if (letterID){
    setTheMainLetter(letterID);
}else{
    console.warn('No letter ID found in the URL.');
}

///////////////////////// !the page is ready, now add some data-driven features below