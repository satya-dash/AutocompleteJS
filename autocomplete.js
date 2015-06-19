(function($){
	$.fn.autocomplete = function(options){
		var defaults = {
			data: [],
			height: '',
			width: '',
			sort: true,
			searchIndex: '-2',
			staticData: null,
			matchType: 'caseinsensitive',
			allowDuplicate: false
		};
		var lastValue = '';
		var target = $(this);
		var display = 'block';
		target.attr('autocomplete', false);
		var options = $.extend(defaults, options);
		function initialize(){
			if(typeof options.data != 'object' && options.data)
				options.data = [options.data];
			if(options.allowDuplicate == false){
				options.data = options.data.filter(function(el, i){ return el && options.data.indexOf(el) == i; });
			}			
		}
		initialize();
		this.getData = function(){
			return options.data;
		}
		this.setOptions = function(curOpt){
			options = $.extend(options, curOpt);
			return this;
		}
		this.setData = function(data){
			if(data == undefined || data == null)
				return this;
			else if(typeof data == 'object'){
				if(options.allowDuplicate == false)
					data = data.filter(function(el, i){ return el && data.indexOf(el) == i; });
				options.data = data;
			}
			else
				options.data = [data];
			sortData();
			return this;
		}
		this.addData = function(newData){
			if(typeof newData != 'object')
				options.data.push(newData);
			else{
				newData.forEach(function(el){
					if(allowDuplicate == true || $.inArray(el, options.data) == -1)
						options.data.push(el);
				});
			}
			sortData();
			return this;
		}
		this.getListElement = function(){
			return dropdown;
		}
		this.getStaticData = function(){
			return options.staticData;
		}
		this.setStaticData = function(staticD){
			options.staticData = staticD;
			return this;
		}
		this.getLastValue = function(){
			return lastValue;
		}
		this.getValue = function(){
			return target.val();
		}
		this.setValue = function(val){
			target.val(val);
			return this;
		}
		this.showList = function(){
			dropdown.css({display: display});
			return this;
		}
		this.hideList = function(){
			dropdown.css({display: 'none'});
			return this;
		}
		this.destroy = function(){
			return detachAll();
		}
		this.rebuildList = function(){
			setDropdownContent('', options.data);
		}
		function detachAll(){
			var tmp = target;
			dropdown.remove();
			target = null;
			options = defaults;
			lastValue = '';
			this.getData = null;
			this.setData = null;
			this.getListElement = null;
			this.getStaticData = null;
			this.setStaticData = null;
			this.getLastValue = null;
			this.getValue = null;
			this.setValue = null;
			this.showList = null;
			this.hideList = null;
			this.destroy = null;
			return tmp;
		}
		function sortData(){
			if(typeof options.data != 'object')
				return options.data;
			if(options.sort == true){
				options.data = options.data.sort(function(a, b){
					if(typeof a == 'string' && options.matchType != 'casesensitive'){	
						a = a.toLowerCase();
					}
					if(typeof b == 'string' && options.matchType != 'casesensitive'){
						b = b.toLowerCase();
					}
					if(a < b)
						return -1;
					if(a > b)
						return 1;
					return 0;
				});
			}
			return options.data;
		}
		sortData();
		var dropdown = $('<div tabindex="1"></div>');
		target.after(dropdown);
		dropdown.css({position: 'absolute', maxWidth: options.width, maxHeight: options.height, paddingRight: '10px', display: 'none' ,visibility: 'visible!important', backgroundColor: '#FFF', boxShadow: '0 0 5px #222', zIndex: '9999999', overflow: 'auto', boxSizing: 'border-box', WebkitBoxSizing: 'border-box', MozBoxSizing: 'border-box'});
		target.focus(function(){
			dropdown.css({display: display});
			setDropdownContent($(this).val(), options.data);
		});

		dropdown.focus(function(){
			dropdown.css({display: display});
			setDropdownContent(target.val(), options.data);
		});

		dropdown.blur(function(ev){
			var focusElem = $(':focus');
			if(focusElem[0] == target[0])
				return;
			dropdown.css({display: 'none'});
		});
	
		target.blur(function(){
			var focusElem = $(':focus');
			if(focusElem[0] == dropdown[0])
				return;
			dropdown.css({display: 'none'});
		});
	
		$(document).click(function(ev){
			var item = ev.target;
			if(dropdown.find(item).length !=0 || item == dropdown[0]){
				return;
			}
			if(item == target[0]){
				dropdown.css({display: display});
				return;
			}
			dropdown.css({display: 'none'});
		});
	
		target.keydown(function(){
			lastValue = $(this).val();
		});

		target.keyup(function(ev){
			if(ev.keyCode == 27){
				if(dropdown.css('display') == display){
					ev.stopPropagation();
				}
				dropdown.css({display: 'none'});
				return;
			}
			var input = $(this).val();
			dropdown.css({display: display});
			setDropdownContent(input, options.data);
		});
	
		function setDropdownContent(value, data){
			if(options.width == ''){
				dropdown.width(target.width() + 10);
			}
			// dropdown.html('<div class="staticData" style="width:100%;padding:5px;cursor:pointer;background-color:#EEE;border-bottom:1px solid #CCC;">'+ options.staticData +'</div>');
			dropdown.children().each(function(){
				if($(this).hasClass('staticData'))
					return;
				$(this).remove();
			});
			var matchStr = getMatchStr(value, data);
			if(matchStr.length == 0){
				dropdown.append('<div style="width:100%;padding:5px;cursor:default;border-bottom:1px solid #CCC;"><i>No match found</i></div>');
				return;
			}
			matchStr.forEach(function(el){
				dropdown.append('<div tabindex="6" name="'+el.id+'" style="width:100%;padding:5px;cursor:pointer;border-bottom:1px solid #CCC;">'+ el.name +'</div>');
			});
			registerClick();
		}
	
		function getMatchStr(value, data){
			if(!data || data.length == 0){
				return [];
			}
			if(typeof data != 'object'){
				return [data];
			}
			if(value == ''){
				return data;
			}
			return data.filter(function(el){
				if(options.searchIndex < -1)
					return el.name.toLowerCase().indexOf(value.toLowerCase()) != -1;
				return el.name.toLowerCase().indexOf(value.toLowerCase()) == options.searchIndex;
			});
		}
		
		function registerClick(){
			dropdown.children('div').off('click');
			dropdown.children('div').click(function(){
				lastValue = target.val();
				dropdown.css({display: 'none'});
				/*if($(this).hasClass('staticData')){
					return;
				}*/
				target.val($(this).text());
				target.attr('name',$(this).attr('name'))
				target.focus();
				setDropdownContent(target.val(), options.data);
			});
			dropdown.children('div').focus(function(){
				dropdown.css({display: display});
			});
		}
		setDropdownContent('', options.data);
		return this;
	};
})(jQuery);
