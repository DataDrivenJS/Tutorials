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



var getRecentlyLikedLetters = function(){
    
    // create data feed, it has to be named so you can manage it
    // in the DD.Console
    var feed = DD.data.feed('Recently Viewed Letters');
    // select the last 4 unique values of 'viewed' meta event
    feed.select(
      DD.data.datapoints.metaevent('liked'),
      DD.data.datapoints.metaevent('liked')
        .timestamp().max().as('lastTimestamp')
    ).orderBy(
      DD.data.feedColumn('lastTimestamp').desc()
    ).limit(4);
    // read the entire data feed:
    DD.reader.read(feed, {}, function(response){
      addList('#recentlyLikedLetters',response.results);
    })
}

var getMostLikedLetters = function(){
    
    // create data feed, it has to be named so you can manage it
    // in the DD.Console
    var feed = DD.data.feed('Most-Liked Letters');
    // select the last 4 unique values of 'viewed' meta event
    feed.select(
      DD.data.datapoints.metaevent('liked'),
      DD.data.datapoints.metaevent('liked')
        .count().as('likes')
    ).orderBy(
      DD.data.feedColumn('likes').desc()
    ).limit(4);
    // read the entire data feed:
    DD.reader.read(feed, {}, function(response){
      addList('#mostLikedLetters',response.results);
    })
}

var getBestConvertingLetters = function(){
    
    var visits = DD.data.segment('Visits with a Viewed Event').where(
        DD.data.datapoints.metaevent('viewed')
    );
    // create data feed, it has to be named so you can manage it
    // in the DD.Console
    var feed = DD.data.feed('The Best-Converting Letters');
    // select and count all values of 'viewed' and 'liked' meta events
    feed.select(
      DD.data.datapoints.metaevent('viewed'),
      DD.data.datapoints.metaevent('viewed')
        .count().as('views'),
      DD.data.datapoints.metaevent('liked'),
      DD.data.datapoints.metaevent('liked')
        .count().as('likes')
    ).mergeOn(
      DD.data.feedColumn('viewed'),
      DD.data.feedColumn('liked')
    ).addColumns(
        DD.data.formula().divide(
          DD.data.feedColumn('likes'),
          DD.data.feedColumn('views')
        ).as('ratio')
    ).having(
        DD.data.feedColumn('views').isGreaterThanOrEqualTo(2)
    ).orderBy(
      DD.data.feedColumn('ratio').desc()
    ).limit(4)
    .from(visits)
    
    // read the entire data feed:
    DD.reader.read(feed, {}, function(response){
      addList('#bestConvertingLetters',response.results);
    })
}
getRecentlyLikedLetters();
getMostLikedLetters();
getBestConvertingLetters();
