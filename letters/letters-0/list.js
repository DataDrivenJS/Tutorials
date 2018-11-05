itemsUl =  document.querySelector('.items ul');

function sortList(ul, property){
    var new_ul = ul.cloneNode(false);

    // Add all list elements to an array
    var lis = [];
    for(var i = ul.childNodes.length; i--;){
        if(ul.childNodes[i].nodeName === 'LI')
            lis.push(ul.childNodes[i]);
    }

    if (property){
        // Sort the lis in descending order
        lis.sort(function(a, b){
           return b.dataset[property] - 
                  a.dataset[property];
        });
    }else{
        // sort alphabetically a-z
        lis.sort(function(a, b){
            var aText = a.lastElementChild.innerText.toLowerCase();
            var bText = b.lastElementChild.innerText.toLowerCase();
            if(aText < bText) return -1;
            if(aText > bText) return 1;
            return 0;
        });
    }
    // Add them into the ul in order
    for(var i = 0; i < lis.length; i++)
        new_ul.appendChild(lis[i]);
    ul.parentNode.replaceChild(new_ul, ul);
}
function orderAlphabetically (){
    sortList (document.querySelector('.items ul'));
    document.querySelector('.items').classList.remove('initial');
}

orderAlphabetically();

///////////////////////// !the page is ready, now add some data-driven features below

