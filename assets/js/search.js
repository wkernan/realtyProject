function search(type){
	$('#searchResultList').empty();
	var query = '' + $('#city').val().trim().toLowerCase() + ', ' + $('#state').val().trim().toLowerCase();
	populate('searchResultList', filter(results, query, type), query);
	return false;
}

function filter(list, param, type){
	var results = [];
	switch(type){
		case 'area':
			for(var i = 0; i < list.length; i++){
				for(var j = 0; j < list[i].areas.length; j++){
					if(list[i].areas[j] == param){
						results.push(list[i]);
					}
				}
			}
			break;
	}
	return results;
}

function populate(target, list, query){
	for(var i = 0; i < list.length; i++){
		var resultElement = '<div id="searchResultItem"><p>' + list[i].name + '</p><p><a href="/agent/' + list[i].id + '">View Profile</a></p></div>';
		$('#' + target).append(resultElement);
	}
	$('#' + target).prepend('<h4>Showing ' + list.length + ' result(s) for ' + query + '</h4>');
}