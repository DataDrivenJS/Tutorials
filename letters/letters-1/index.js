var addList = function(listID, results){
    var ul = document.querySelector(listID+' ul');
    if (ul){
        ul.innerHTML='';
        for (var i = 0; i<results.length; i++){
            var li = document.createElement('li');
            var letterID = results[i].viewed || results[i].liked || results[i].Merged;
            var letterClassName = letterID.split('-');
            var letter = letterClassName.shift();
            li.className = letterClassName.join(' ');
            li.innerHTML = ('<a href="item.html?letter='+letterID+'">'+letter+'</a></li>');
            ul.appendChild(li);
        }
        ul.closest('.top-of-the-list').classList.remove('empty');
    }else{
        console.error('No list for the "'+listID+' ul" selector found');
    }
};

///////////////////////// !the page is ready, now add some data-driven features below

