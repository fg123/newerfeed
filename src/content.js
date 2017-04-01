// This script injects data to facebook newsfeed page

var api_key = "ca4f45d8a33049c1a7a6ba97cfc8bd1a";
var frequency = 5;

// IMPLEMENTATION //

document.addEventListener("DOMContentLoaded", checkNewsFeed);
var selected_sources = [];
var articles = [];
var injected = 1;

var scrollTimer, lastScrollFireTime = 0;

$(document).scroll(function() {
    var minScrollTime = 50;
    var now = new Date().getTime();

    function processScroll() {
		var howMany = frequency * injected;
		$('*[data-testid="fbfeed_story"]').not(".newerfeed").each(function (index) { 
			howMany--;
			if (howMany <= 0) { 
				// Time to inject!
				injected++;
				getArticle($(this));
				return false;
			}
		});
    }

    if (!scrollTimer) {
        if (now - lastScrollFireTime > (3 * minScrollTime)) {
            processScroll();   // fire immediately on first scroll
            lastScrollFireTime = now;
        }
        scrollTimer = setTimeout(function() {
            scrollTimer = null;
            lastScrollFireTime = new Date().getTime();
            processScroll();
        }, minScrollTime);
    }
});


// checkNewsFeed() checks if this is a page with newsfeed on it
function checkNewsFeed() { 
	if ($("#newsFeedHeading").length) { 
		getSources();
		//injectNews();
	}
}

// getSources() retreives sources from stored extension data
function getSources() { 
	chrome.storage.sync.get({
		sources: []
	}, function (items) { 
		selected_sources = items.sources;
		getArticle("#newsFeedHeading");
	});	
}
// getArticle(injectPoint) retreives a random article from a random source
function getArticle(injectPoint) {
	var r_source = Math.floor(Math.random() * selected_sources.length);
	
	var source_url = "https://newsapi.org/v1/articles?source="
		+ selected_sources[r_source] + "&apiKey=" + api_key;
	$.get(source_url, function (data) {
		// select random article
		var r_art = Math.floor(Math.random() * data.articles.length);
		var article = data.articles[r_art];
//		console.log("SELECTED THIS ARTICLE " + article);
		var source;
		$.get("https://newsapi.org/v1/sources?language=en", function (sdata) {
			for (var i = 0; i < sdata.sources.length; i++) { 
				if (sdata.sources[i].id == selected_sources[r_source]) { 
					source = sdata.sources[i];
					break;
				}
			}
			//console.log(source);
			buildNewStory(article, source, injectPoint);
		});
	});
		
}

// buildNewStory(article, source, injectPoint) given an article and a source 
//   object, returns a html DOM object ready for INJECTION!
function buildNewStory(article, source, injectPoint) { 
	// Here is the standard string first.
	var articleTime = Date.parse(article.publishedAt);
	var parser = document.createElement('a');
	parser.href = article.url;

	var replaceData = [
		["\\$\\[SOURCEURL\\]", source.url],
		["\\$\\[SOURCEIMG\\]", source.urlsToLogos.medium],
		["\\$\\[SOURCENAME\\]", source.name],
		["\\$\\[TIMELONG\\]", moment(articleTime).format('MMMM Do YYYY, h:mm:ss a')],
		["\\$\\[TIMEUTC\\]", articleTime.UTC],
		["\\$\\[ARTICLESUMMARY\\]", article.description],
		["\\$\\[ARTICLELINK\\]", article.url],
		["\\$\\[ARTICLELINKSHORT\\]", parser.hostname],
		["\\$\\[ARTICLEIMG\\]", article.urlToImage],
		["\\$\\[ARTICLETITLE\\]", article.title],
		["\\$\\[ARTICLEDESC\\]", "By: " + article.author]
	];
	$.get(chrome.runtime.getURL("newsfeedItem.html"), function (data) { 
		var datastring = data;
		for (var i = 0; i < replaceData.length; i++) { 
			var pattern = new RegExp(replaceData[i][0], "g");
			datastring = datastring.replace(pattern, replaceData[i][1]);
		}
		
		$(injectPoint).after($(datastring));
	});
}