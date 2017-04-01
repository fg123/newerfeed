// options.js, controls the options page
var categories_string = ["Business", "Entertainment", "Gaming", "General", "Music", "Politics", "Science and Nature", "Sports", "Technology"];
var categories_id = ["business", "entertainment", "gaming", "general", "music", "politics", "science-and-nature", "sport", "technology"];


$(document).ready(function () {
	for (var i = 0; i < categories_string.length; i++) { 
		var new_object = $('<div class="col-md-2"><div class="checkbox category_cb">\
		<label><input type="checkbox" value="' + categories_id[i] + '">' + categories_string[i] + '</label></div></div>');
		$(".categories").append(new_object);
	}
	$(".category_cb input").change(function () { 
		// On Category click
		var categories = [];
		$(".category_cb input").each(function () { 

			if ($(this).prop('checked')) {
				categories.push($(this).val());
			}	
		});
		//var sources = [];
		$.get("https://newsapi.org/v1/sources?language=en", function (data) {
			var hasSource = false;
			$(".sourceDisplay").html("");
			// iterate through all sources to get sources that match user's categories
			for (var i = 0; i < data.sources.length; i++) {
				if (categories.indexOf(data.sources[i].category) != -1)
				{
					var cur_source = data.sources[i];
					var new_object = $('<div class="col-md-4"><div class="checkbox source_cb">\
						<label><input type="checkbox" value="' + cur_source.id + '">' + cur_source.name + '</label></div></div>');
					$(".sourceDisplay").append(new_object);
					hasSource = true;
					//sources.push(data.sources[i]);
				}
			}
			if (!hasSource) { 
				$(".sourceDisplay").html("No Sources Found!");
			}
			
		});
	});
	$(".cselectBtn").click(function () {
		$(".category_cb input").prop('checked', true).change();
	});
	$(".cunselectBtn").click(function () {
		$(".category_cb input").prop('checked', false).change();
	});
});

function generate_sources(categories) { 
	var sources = [];
	$.get("https://newsapi.org/v1/sources?language=en", function (data) {
		
		// iterate through all sources to get sources that match user's categories
		for (var i = 0; i < data.sources.length; i++) {
			if (categories.indexOf(data.sources[i].category) != -1)
			{
				sources.push(data.sources[i]);
			}
		}
		return sources;
	});

}