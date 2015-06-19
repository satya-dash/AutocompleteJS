# AutocompleteJS
You can put objects in an array to choose where you need to show something to the end user and get the value of something else apart from the value it is showing in the text box.

The format of the array should be like below.
	var arr = [
			{
				id: '1',
				name: 'Icecream'	
			},
			{
				id: '2',
				name: 'Chocolate'	
			},
			{
				id: '3',
				name: 'Biscuit'	
			},
			{
				id: '4',
				name: 'Frooti'	
			},
			{
				id: '5',
				name: 'Juice'	
			},
	]

Below is the format you should write to apply an autocomplete dropdown in a input textbox.
	$('#listDropDown').autocomplete({
        data: arr
    });