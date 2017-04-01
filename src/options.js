// options.js, controls the options page
var categories_string = ["Business", "Entertainment", "Gaming", "General", "Music", "Politics", "Science and Nature", "Sports", "Technology"];
var categories_id = ["business", "entertainment", "gaming", "general", "music", "politics", "science-and-nature", "sport", "technology"];

var selected_sources = [];

$(document).ready(function () {
	$(".noSource").hide();
	for (var i = 0; i < categories_string.length; i++) {
		var new_object = $('<div class="col-md-4"><div class="checkbox category_cb">\
		<label><input type="checkbox" checked value="' + categories_id[i] + '">' + categories_string[i] + '</label></div></div>');
		$(".categories").append(new_object);
	}
	$.get("https://newsapi.org/v1/sources?language=en", function (data) {
		// iterate through all sources to get sources that match user's categories
		$(".selectedSources div").append('<ul class="list-group">');
		for (var i = 0; i < data.sources.length; i++) {
			var cur_source = data.sources[i];
			var new_object = $('<div class="col-md-4"><div class="checkbox source_cb">\
				<label><input type="checkbox" data-category="' + cur_source.category + '" value="' +
				cur_source.id + '" name="' + cur_source.name +
				'">' + cur_source.name + '</label></div></div>');
			var side_object = $('<li class="list-group-item" id="' + cur_source.id + '"><span class="badge">&times;</span>' + cur_source.name + '</li>');
			$(".sources").append(new_object);
			$(".selectedSources div ul").append(side_object);
			//sources.push(data.sources[i]);
		}
		finish_setup();
	});
});
function finish_setup() {
	retreiveSources();
	$(".selectedSources div ul li .badge").click(function () {
		// Delete a selected source
		var id = $(this).parent().attr("id");
		$(".source_cb input[value=" + id + "]").prop("checked", false);
		updateSources();
	});
	$(".source_cb input").change(function () {
		updateSources();
	});
	$(".category_cb input").change(function () { 
		// On Category click
		var categories = [];
		$(".category_cb input").each(function () { 
			if ($(this).prop('checked')) {
				categories.push($(this).val());
			}	
		});
		//var sources = [];
	
		var hasSource = false;
		// iterate through all sources to get sources that match user's categories
		$(".source_cb input").each(function () {
			if (categories.indexOf($(this).data("category")) != -1) {
				$(this).parent().parent().parent().show();
				hasSource = true;
			}
			else { 
				$(this).parent().parent().parent().hide();
			}
		});
		if (!hasSource) {
			$(".noSource").show();
		}
		else { 
			$(".noSource").hide();
		}
	});
	$(".cselectBtn").click(function () {
		$(".category_cb input").prop('checked', true).change();
	});
	$(".cunselectBtn").click(function () {
		$(".category_cb input").prop('checked', false).change();
	});
	$(".sselectBtn").click(function () {
		$(".source_cb input").each(function () { 
			if ($(this).parent().parent().parent().is(":visible")) { 
				$(this).prop('checked', true).change();
			}
		});
	});
	$(".sunselectBtn").click(function () {
		$(".source_cb input").each(function () { 
			if ($(this).parent().parent().parent().is(":visible")) { 
				$(this).prop('checked', false).change();
			}
		});
	});	
}

// updateSources will update the source display as well as update google chrome
//   data storage
function updateSources() { 
	selected_sources = [];
	var hasSource = false;
	$(".source_cb input").each(function () {
		var id = $(this).val();
		if ($(this).prop("checked")) {
			$("li#" + id).show();
			hasSource = true;
			selected_sources.push(id);
		}
		else { 
			$("li#" + id).hide();
		}
	});
	if (!hasSource) {
		$(".noSourceSel").show();
	}
	else { 
		$(".noSourceSel").hide();
	}
	chrome.storage.sync.set({ sources: selected_sources });
	console.log("Saved to sources: " + selected_sources);
}

function retreiveSources() { 
	chrome.storage.sync.get({
		sources: []
	}, function (items) { 
		selected_sources = items.sources;
	
		for (var i = 0; i < selected_sources.length; i++) { 

			$(".source_cb input[value=" + selected_sources[i] + "]").prop("checked", true);
		}
		updateSources();
	});	
}