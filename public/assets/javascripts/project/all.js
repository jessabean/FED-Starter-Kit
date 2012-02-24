/**
 * My script file
 *
 * @depend ../vendor/jquery.1.6.4.min.js
 * @depend ../vendor/trackiffer.js
 */

var NAMESPACE = NAMESPACE || {};

(function(window, document, $, A, undefined){ 

	"use strict";

	/* @group base */
		
		A.features = {};
		A.instances = {};

		A.make = function(feature){

			var slug = feature.name.toLowerCase(),
				constructor = createConstructorFromFeature(feature),
				instantiateAndInit = function(index){
					var $elem = $(this),
						instance;
					if($elem.instance(slug) === undefined){
						instance = storeNewInstance($elem, constructor, slug);
						instance.before($elem, index); 
					}
				};
				
			addToNamespace(feature, slug);
			$(feature.selector).each(instantiateAndInit);
			addIteratorToInstances(slug);

		};

	/* @end */

	/* @group OO helpers */
	
		function storeNewInstance($elem, constructor, slug){
			var instance = new constructor();
			$elem.data('instance-' + slug, instance);
			A.instances[slug].push(instance);
			return instance;
		};

		function addToNamespace(feature, slug){
			A.features[feature.name] = feature;
			A.instances[slug] = A.instances[slug] || [];
		}; 

		function createConstructorFromFeature(feature){
			var constructor = function(){},
			base = function(){};
			constructor.prototype = $.extend(new A.features.Base, feature.proto);
			return constructor;
		};

		function addIteratorToInstances(slug){
			var array = A.instances[slug];
			array.each = function(){
				var args = Array.prototype.slice.call(arguments, 0),
					method_name = args.shift();
				for(var i = 0, len = array.length; i < len; i++){
					var instance = array[i];
					instance[method_name].apply(instance, args);
				}
			};
		};

	/* @end */
	
	/* @group utility */

		A.util = {
			modern_opacity : $('html').hasClass('modernopacity')
		};

		/* @group jQuery helpers */

			$.fn.instance = function(name){
				return $(this).data('instance-' + name);
			};
		
			$.fn.transparentFallback = function(transparentMethod, fallbackMethod){
				var args = Array.prototype.slice.call(arguments, 0),
					transparent_method = args.shift(),
					fallback_method = args.shift();
					method = A.util.modern_opacity ? transparentMethod : fallbackMethod;
				return $(this)[method].apply(this, arguments);
			}
		
		/* @end */

	/* @end */    

	/* @group classes */
	
		/* @group base */
		
			A.features.Base = function(){};

			A.features.Base.prototype = {
				before : function($elem, index){
					this.$elem = $elem;
					this.init && this.init(index); 
				},
				kill : function(){
					return this.proxy(arguments, true);
				},
				fix : function(){
					return this.proxy(arguments);
				},
				proxy : function(args, kill_event){
					var self = this,
						args_array = Array.prototype.slice.call(args, 0),
						method = args_array.shift(),
						callback = function(argument){
							var scoped_args = args_array.slice(0);
							scoped_args.unshift(argument);
							kill_event && self.killEvent(argument);
							self[method].apply(self, scoped_args);
						};
					return callback;
				},
				killEvent : function(event){
					event.preventDefault(); 
					event.stopPropagation();
				},
				cacheDom : function(object){
					for(var key in object){
						var name = '$' + key,
							selector_or_elem = object[key],
							is_string = typeof selector_or_elem === 'string';
						this[name] = is_string ? this.$elem.find(selector_or_elem) : selector_or_elem;
					}
				}
			};

		/* @end */
			
		/* @group click to toggle contents */
		
			A.make({
				name : 'ToggleContents', 
				selector : 'a.togglecontents', 
				proto : {
					init : function(index){
						this.is_on = false;
						this.setupDom(index);
						this.turnOff();
					},
					setupDom : function(index){
						this.cacheDom({
							'b' : 'b',
							'on' : '.on',
							'off' : '.off'
						});
						var text = this.$b.text();
						this.$b.text(text + ' ' + index);
						this.$elem.click(this.kill('toggle', index));
					},
					toggle : function(event, index, parameters){
						console && console.log && console.log('Toggle ' + index + ' clicked!');
						this.is_on ? this.turnOff() : this.turnOn();
						this.is_on = !this.is_on;
					},
					turnOn : function(){
						this.$on.show();
						this.$off.hide();
					},
					turnOff : function(){
						this.$on.hide();
						this.$off.show();
					}
			}});

		/* @end */
		
	/* @end */

	/* @group tracking */
	
		window._gaq = [
			['_setAccount', 'UA-25861682-1'],
			['_trackPageview']
		];
	
		trackiffer({
			'rule' : ['Category', 'Action', 'Label', 1]
		});

	/* @end */
	
})(window, document, jQuery, NAMESPACE);

