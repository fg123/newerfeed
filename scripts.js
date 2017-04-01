var apiKey = "ca4f45d8a33049c1a7a6ba97cfc8bd1a"
var category = ["technology", "business"];

// fisher yates shuffle function, www.frankmitchell.org/2015/01/fisher-yates/
function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

$.get("https://newsapi.org/v1/sources?language=en", function(data) {
  var ids = [];
  // iterate through all sources to get sources that match user's categories
  for (var i = 0; i < data.sources.length; i++) {
    if (category.indexOf(data.sources[i].category) != -1)
    {
      ids.push(data.sources[i].id);
    }
  }
  console.log(ids)
  // randomize sources list
  shuffle(ids);
  // take first 5 articles
  for (var i = 0; i < ids.length; i++) {
    if (i > 4)
    {
      break;
    }
    var source_url = "https://newsapi.org/v1/articles?source=" + ids[i] + "&apiKey=" + apiKey;
    $.get(source_url, function(data) {
      console.log(data.articles[0]);
    });
  }
});
