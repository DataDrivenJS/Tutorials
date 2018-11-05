
/*
    retrieves the letterID from URL which will be used to 
    show the letter. It can also be used for tracking.
*/

function getLetterID(){
    var id;
    var letterParam = window.location.search.split('letter=');
    if (letterParam[1] && letterParam[1]!=''){
        id = letterParam[1].split('&')[0];
    }else{
        console.warn('No letter ID found in the URL. Using a dummy ID instead');
        id = 'a-green-round-sans-bold-uppercase';
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
    history.back();
    e.preventDefault();
});

/* 
    set up the page
*/

var letterID = getLetterID();
setTheMainLetter(letterID);

///////////////////////// !the page is ready, now add some data-driven features below

/*
    adds a stat item to the page with views or likes
*/

function addStat (type, message){
    var tpl = '<div class="stat '+type+'">'+message+'</div>';
    document.querySelector('.stats').innerHTML+=tpl;
}

/* 
    Get count of page views of the specified letter and show
    appropriate message in the stats. If a letter was viewed
    in the past, get how many times it was liked
*/

var getLetterPageViews = function(id){
    
    // define the feed and its content
    var feed = DD.data.feed("Letter Page Views").select(
        DD.data.datapoints.metaevent("URL").contains('/item.html').as('URL'),
        DD.data.datapoints.metaevent("URL").contains('/item.html').count().as('views')
    );

    // select only views of the current page
    var query = DD.data.feedQuery().select(
        DD.data.feedColumn('views')
    ).where(
        DD.data.feedColumn('URL').equals(window.location.href)
    );
    
    // read the data and handle results
    DD.reader.read (feed, query, function(response){
        if (response.results[0]) {
            var phrase;
            if (response.results[0].views==1){
                phrase = 'time.';
            }else{
                phrase = 'times.';
            }
            addStat('views','Viewed <strong>'+response.results[0].views+'</strong> '+phrase);
        
            // there are views, let's see if there were likes too
            getLetterLikes(id);
        }else{
            addStat("views","You are the first person to view this letter, <strong>isn't it pretty?</strong>");
        }
    });
}

/* 
    Get count of likes of the specified letter and show
    appropriate message in the stats.
*/

var getLetterLikes = function(id){
    
    // define the feed and its content
    var feed = DD.data.feed("Letter Likes").select(
        DD.data.datapoints.metaevent("liked"),
        DD.data.datapoints.property("visitorID").countDistinct().as('likes')
    );
        //.having(DD.data.feedColumn('liked'));
        //.from(DD.data.segment().where(DD.data.datapoints.metaevent("liked")));

    var query = DD.data.feedQuery().select(
        DD.data.feedColumn('likes')
    ).where(
        DD.data.feedColumn('liked').equals(id)
    );
    
    DD.reader.read (feed, query, function(response){
        if (response.results[0]) {
            var phrase;
            if (response.results[0].likes==1){
                phrase = 'person likes';
            }else{
                phrase = 'people like';
            }
            addStat('likes', '<strong>'+response.results[0].likes+'</strong> '+phrase+' it.');
        }else{
            addStat('views','This letter is sad. <strong>Nobody likes it</strong>, do you?');
        }
    });
}

/* 
    add a button to the page and track clicks as likes
*/

function addLikeBtn(){
    var likeBtn = document.createElement('a');
    likeBtn.classList.add('likeBtn');
    likeBtn.href = '#like';
    likeBtn.innerHTML = '&hearts;';
    
    var container = document.querySelector('.actions');
    container.insertBefore(likeBtn, container.firstElementChild);

    likeBtn.addEventListener('click',function(e){
        if (!likeBtn.classList.contains('liked')){
            likeBtn.classList.add('liked');
            // use global letterID to track the liked letter
            DD.tracker.trackMetaEvent('liked',letterID);
        }else{
            // already liked during this page view, ignore
            // idea: we could create a data feed with letters that users
            // liked in the past or just store likes in Local Storage
            // and then mark likeBtn as liked when the page loads
        }
        e.preventDefault();
    });
}

addLikeBtn();
getLetterPageViews(letterID);