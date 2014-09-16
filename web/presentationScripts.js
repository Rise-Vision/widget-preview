
function gadgetRequest(id, xmlUrl) {
    try {   	
		if (id != null) {
			gadgetRequestAttempt(id, xmlUrl, 1);
   		}
    }
    catch (err) {
    	console.log("gadgetRequest - " + id + " - " + err.message);
    }}

function gadgetRequestAttempt(id, xmlUrl, attempt) {
	if (xmlUrl != null && attempt < 4) {
		console.log("Gadget ID=" + id + " XML is loading (" + attempt + ").");

		try {
			params = {};
			params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
			
			gadgets.io.makeRequest(xmlUrl,
					function(obj) {
						if (obj.errors != "") {
							parent.itemError(presFrame, id, obj.rc + "");
						}
						else {
							console.log("Item " + id + " - gadgetLoadResponse - XML Loaded");
							
							parent.reportGadgetLoadEvent(presFrame, id, obj.text);
						}
					},
					params);
		} 
		catch (err) { 
			console.log("Gadget makeRequest error");
		}
		
		$(document).oneTime("60s", "t" + id, function() {
			gadgetRequestAttempt(id, xmlUrl, attempt + 1);
		});
	}
	else {
		console.log("Gadget ID=" + id + " failed to load.");
	}
}

function itemLoaded(id) {
	try {
		console.log("Item ID=" + id + " is loaded.");

		$(document).stopTime("t" + id);
		
		triggerEvent("gadgetLoaded", id);
	}
    catch (err) {
    	console.log("Item " + id + " - rscmd_loaded - " + err.message);
    }
}

function itemError(id, reason) {
	parent.itemError(presFrame, id, reason);
}

function itemDone(id) {
	parent.itemDone(presFrame, id);
	
    triggerEvent("gadgetDone", id);
}

function triggerEvent(type, id) {
    try {
    	setTimeout(function() {
    		$(document).trigger(type, id);
    	}, 100);
    }
    catch (err) {
    	console.log("trigger('" + type + "') - " + id + " - " + err.message);
    }
}

function getEmbedData(id, parentId) {
	return parent.getEmbedData(id, parentId);
}

function playCmd(id) {
    try {   
    	if (id.charAt(id.length - 1) == "p") {
    	    document.getElementById("if_" + id).contentWindow.embedPlay();
    	}
    	else if (id.charAt(id.length - 1) == "v") {
    		$('#' + id).css('z-index', 2);
    	    document.getElementById("if_" + id).contentWindow.play();
    	}
    	else if (id.charAt(id.length - 1) == "g" || id.charAt(id.length - 1) == "w") {
    		gadgets.rpc.call('if_' + id, 'rscmd_play_' + id, null);
    	}
    	/*
    	 * Images do not have a play() command
    	else if (id.charAt(id.length - 1) == "i") {
    	}
    	*/
//    	else if (id.charAt(id.length - 1) == "w") {
//    		if (document.getElementById("if_" + id).contentWindow) {
//    			document.getElementById("if_" + id).contentWindow.postMessage("play", "*");
//    		}
//    	}
    	
		triggerEvent("playCommand", id);
    }
    catch (err) {
    	console.log("Item " + id + " - rscmd_play - " + err.message);
    }
    
//    showElement(id);
}

function pauseCmd(id) {
    try { 
    	if (id.charAt(id.length - 1) == "p") {
    	    document.getElementById("if_" + id).contentWindow.embedPause();
    	}
    	else if (id.charAt(id.length - 1) == "v") {
    		$('#' + id).css('z-index', 1);
    	    document.getElementById("if_" + id).contentWindow.pause();
    	}
    	else if (id.charAt(id.length - 1) == "g" || id.charAt(id.length - 1) == "w") {
    		gadgets.rpc.call('if_' + id, 'rscmd_pause_' + id, null);
    	}
//    	else if (id.charAt(id.length - 1) == "w") {
//    		if (document.getElementById("if_" + id).contentWindow.stop) {
//    			document.getElementById("if_" + id).contentWindow.stop();
//    		}
//    	}
    	
		triggerEvent("pauseCommand", id);
    }
    catch (err) {
    	console.log("Item " + id + " - rscmd_pause - " + err.message);
    }
    
//    if (hide) {
//    	hideElement(id);
//    }
}

function stopCmd(id) {
    try { 
    	if (id.charAt(id.length - 1) == "p") {
    	    document.getElementById("if_" + id).contentWindow.embedStop();
    	}
    	else if (id.charAt(id.length - 1) == "v") {
    		$('#' + id).css('z-index', 1);
    	    document.getElementById("if_" + id).contentWindow.stop();
    	}
    	else if (id.charAt(id.length - 1) == "g" || id.charAt(id.length - 1) == "w") {
    		gadgets.rpc.call('if_' + id, 'rscmd_stop_' + id, null);
    	}
//    	else if (id.charAt(id.length - 1) == "w") {
//    		if (document.getElementById("if_" + id).contentWindow.stop) {
//    			document.getElementById("if_" + id).contentWindow.stop();
//    		}
//    	}
    	
		triggerEvent("stopCommand", id);
    }
    catch (err) {
    	console.log("Item " + id + " - rscmd_stop - " + err.message);
    }
    
//    hideElement(id);
}


(function() {
//	window.addEventListener("message", receiveMessage, false);
//	 
//	function receiveMessage(event)
//	{
////	  if (event.origin !== "http://www-open-opensocial.googleusercontent.com")
////	    return;
//	 
//	  var eventData = JSON.parse(event.data);
//	  
//	  if (eventData) {
//		  if (eventData.s == "rsevent_ready") {
//			  itemReady.apply(this, eventData.a);
////			  itemReady(eventData.a);
//		  }
//		  else if (eventData.s == "rsevent_done") {
//			  itemDone.apply(this, eventData.a);
//		  }
//		  else if (eventData.s == "rsparam_get") {
//			  getParam.apply(this, eventData.a);
//		  }
//	  }
//	}
	
	try {
		//gadgets.rpc.register('rsevent_loaded', itemLoaded);
		//gadgets.rpc.register('rsevent_ready', itemReady);
		gadgets.rpc.register('rsevent_done', itemDone);
    gadgets.rpc.register('rsparam_get', function(id, param) {      
      var value;
    	if (typeof(param) == 'string') {
    		value = getParam(param, id);
    	}
    	else if (param.length) {
    		value = new Array();
    		for (i = 0; i < param.length; i++) {
    			value[i] = getParam(param[i], id);
    		} 
    	}
	   	gadgets.rpc.call('if_' + id, 'rsparam_set_' + id, null, param, value);
		});
    
//		gadgets.rpc.register('rsmakeRequest_get', function(id, callbackName, url, optParams) {
//			gadgets.io.makeRequest(url, function(data) {
//				data['data'] = null;
//				
//				gadgets.rpc.call('if_' + id, callbackName, null, data);				
//			}, optParams);
//		});
	}
	catch (err) {
		console.log("RPC Registration Error!");
	}

	window.onload = function() {
		try {
		    // Initialize page style...
		    document.body.style["MozUserSelect"] = "none";
		    document.body.style["KhtmlUserSelect"] = "none";
		    document.body.style["WebkitUserSelect"] = "none";
		    document.body.style["UserSelect"] = 'none';
		    
//		    document.body.onmousedown = function(e){if(e.button==1)return false};
		    
		    window.oncontextmenu = function() {
				return false;
			};
		    
//		    parent.onPresentationLoad(presFrame);
		} catch (err) {
	    	console.log("Initialize presentation style - " + err.message);
		}
	};
}());

function getPlaceholderIFrameIds(id) {
    try { 
		var iFrameIds = parent.getPlaceholderIFrameIds(presFrame, id);
		
		return iFrameIds.split(',');
    }
    catch (err) {
    	console.log("Placeholder " + id + " - getPlaceholderIFrameIds - " + err.message);
    }
}

function updateGadgetWrapper(containerName, htmlName, width, height, transition) {
    try {   	
        myFrame = getElement(htmlName);
        if (myFrame == null) {
            var myDiv = createNewElement(htmlName, 'div');
//            var myDiv = createNewElement(htmlName, 'div', width, height);

            if (myDiv != null) {
                myDiv.style["overflow"] = "hidden";
//                myDiv.style["visibility"] = "hidden";
                
                myDiv.style["position"] = "relative";

                document.getElementById(containerName).appendChild(myDiv);
            }
        }
    }
    catch (err) {
    	console.log("updateGadgetWrapper - " + htmlName + " - " + err.message);
    }
}

function updateGadgetOld(html, containerName, htmlName, width, height, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

			renderGadgetAttemptOld(html, htmlName, 1);
   		}
    }
    catch (err) {
    	console.log("updateGadgets - " + htmlName + " - " + err.message);
    }
}

function renderGadgetAttemptOld(html, htmlName, attempt) {
	if (html != null && attempt < 4) {
        myContainer = getElement(htmlName);
        if (myContainer != null) {
        	// clear Gadget div prior to gadget being requested again
        	myContainer.innerHTML = '';
        }
		
        myContainer.innerHTML += html;
	    
	    gadgets.rpc.setupReceiver('if_' + htmlName);
		
		console.log("Gadget ID=" + htmlName + " is loading (" + attempt + ").");

		$(document).oneTime("60s", "t" + htmlName, function() {
			renderGadgetAttemptOld(html, htmlName, attempt + 1);
		});
	}
	else {
		console.log("Gadget ID=" + htmlName + " failed to load.");
	}
}

/// functionality for old Gadget server
//function updateGadgets(params, containerName, htmlName, width, height, transition) {
//  try {   	
//		if (htmlName != null) {
//	        myContainer = getElement(containerName);
//			createContainer(htmlName, containerName, transition);
////			createContainer(htmlName, containerName, width, height, transition);
//
//			requestGadgetScript(params, htmlName, 1);
//		}
//  }
//  catch (err) {
//  	console.log("updateGadgets - " + htmlName + " - " + err.message);
//  }
//}

//function requestGadgetScript(params, htmlName, attempt) {
//	if (params != null && attempt < 4) {
//        myContainer = getElement(htmlName);
//        if (myContainer != null) {
//        	// clear Gadget div prior to gadget being requested again
//        	myContainer.innerHTML = '';
//        }
//		
////		var head = document.getElementsByTagName('head')[0];
////		var scriptV = document.createElement('script');
////		scriptV.type = 'text/javascript';
////		scriptV.src = params;
////		head.appendChild(scriptV);
//		
//		console.log("Gadget ID=" + htmlName + " is loading (" + attempt + ").");
//
//		$.ajax({
////			url: params + '&v=' + Math.floor(Math.random()*1001),
//			url: params,
//			dataType: 'script',
//			success: function() {
//				console.log("Gadget ID=" + htmlName + " responded.");
//				
//				$(document).oneTime("60s", "t" + htmlName, function() {
//					requestGadgetScript(params, htmlName, attempt + 1);
//				});
//			}
//		});
//	}
//	else {
//		console.log("Gadget ID=" + htmlName + " failed to load.");
//	}
//}

// [AD] Duplicate function names from the previous release need to be 
// available for deployment
// Old Name - updateWidget
// New Name - updateGadget
// Remove after the Widgets release
//function updateWidget(html, containerName, htmlName, transition) {
//	updateGadget(html, containerName, htmlName, transition);
//}

function updateGadget(html, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null && html != null) {
			createContainer(htmlName, containerName, transition);

			myContainer = getElement(htmlName);
	        if (myContainer != null) {
	        	// clear Gadget div prior to gadget being requested again
	        	myContainer.innerHTML = '';
	        }
			
	        myContainer.innerHTML += html;
		}
    }
    catch (err) {
    	console.log("updateGadget - " + htmlName + " - " + err.message);
    }
}

//[AD] Duplicate function names from the previous release need to be 
//available for deployment
//Old Name - addWidget
//New Name - addGadgetHtml
//Remove after the Widgets release
//function addWidget(frameName, html) {
//	addGadgetHtml(frameName, html);
//}

function addGadgetHtml(frameName, html) {
    var myFrame = getElement(frameName);
    
    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
    myFrameObj.document.open();
    myFrameObj.document.write(html);
    myFrameObj.document.close();
    
    gadgets.rpc.setupReceiver(frameName);
	    
	console.log("Gadget ID=" + frameName + " is loading.");

}

//[AD] Due to duplicate function names, can't use updateWidget name
//Current Name - updateHtmlWidget
//New Name - updateWidget
//Rename after the Widgets release
//Also requires name change in ViewerWidgetController's WIDGET_SCRIPT var 
function updateHtmlWidget(url, containerName, htmlName, transition) {
	updateWidget(url, containerName, htmlName, transition);
}

function updateWidget(url, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

	        var myContainer = getElement(htmlName);
            var myFrame = createNewElement('if_' + htmlName, 'iFrame');
//            var myFrame = createNewElement('if_' + htmlName, 'iFrame', width, height);
            myContainer.appendChild(myFrame);
            
    	    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
          myFrame.src = url;
          
 //    	    myFrameObj.location.href = url;
    	    myFrameObj.onload = new function() {
//        	    parent.itemReady(presFrame, htmlName, false, false, false, false, false);
        	    
        	    gadgets.rpc.setupReceiver('if_' + htmlName);
    	    }
   		}
    }
    catch (err) {
    	console.log("updateWidget - " + htmlName + " - " + err.message);
    }
}

function updateText(text, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

	        var myContainer = getElement(htmlName);
            var myFrame = createNewElement('if_' + htmlName, 'iFrame');
//            var myFrame = createNewElement('if_' + htmlName, 'iFrame', width, height);
            myContainer.appendChild(myFrame);
            
    	    myFrame.onload = function() {
        	    myFrameObj.document.body.style["MozUserSelect"] = "none";
        	    myFrameObj.document.body.style["KhtmlUserSelect"] = "none";
        	    myFrameObj.document.body.style["WebkitUserSelect"] = "none";
        	    myFrameObj.document.body.style["UserSelect"] = 'none';
        	    
//        	    myFrameObj.document.body.onmousedown = function(e){if(e.button==1)return false};   
        	    
        	    myFrameObj.window.oncontextmenu = function() {
    				return false;
    			};
    	    };

    	    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
    	    myFrameObj.document.open();
    	    myFrameObj.document.write(text);
    	    myFrameObj.document.close();
    	    
    	    parent.itemReady(presFrame, htmlName, false, false, false, false, false);
		}
    }
    catch (err) {
    	console.log("updateText - " + htmlName + " - " + err.message);
    }
}

function updateImage(html, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

            renderImageAttempt(html, htmlName, 1);
   		}
    }
    catch (err) {
    	console.log("updateImage - " + htmlName + " - " + err.message);
    }
}

function renderImageAttempt(html, htmlName, attempt) {
	if (html != null && attempt < 4) {
        var myContainer = getElement(htmlName);
        if (myContainer != null) {
        	// clear Gadget div prior to gadget being requested again
        	myContainer.innerHTML = '';
        }
        
        var myFrame = createNewElement('if_' + htmlName, 'iFrame');
//      var myFrame = createNewElement('if_' + htmlName, 'iFrame', width, height);
        myContainer.appendChild(myFrame);
		
	    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
	    myFrameObj.document.open();
	    myFrameObj.document.write(html);
	    myFrameObj.document.close();
	    
		console.log("Image ID=" + htmlName + " is loading (" + attempt + ").");

		$(document).oneTime("60s", "t" + htmlName, function() {
			renderImageAttempt(html, htmlName, attempt + 1);
		});
	}
	else {
		console.log("Image ID=" + htmlName + " failed to load.");
	}
}


function updateEmbed(url, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

	        var myContainer = getElement(htmlName);
            var myFrame = createNewElement('if_' + htmlName, 'iFrame');
//            var myFrame = createNewElement('if_' + htmlName, 'iFrame', width, height);
            myContainer.appendChild(myFrame);
            
    	    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
    	    myFrameObj.location.href = url;
   		}
    }
    catch (err) {
    	console.log("updateEmbed - " + htmlName + " - " + err.message);
    }
}

function updateVideo(html, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

	        var myContainer = getElement(htmlName);
            var myFrame = createNewElement('if_' + htmlName, 'iFrame');
//            var myFrame = createNewElement('if_' + htmlName, 'iFrame', width, height);
            
//            myContainer.insertBefore(myFrame, myContainer.firstChild);
            myContainer.appendChild(myFrame);
            
    	    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
    	    myFrameObj.document.open();
    	    myFrameObj.document.write(html);
    	    myFrameObj.document.close();
    	    
//			var instance = $('#' + containerName).data( 'slicebox' );
//			if ( instance ) {
//				instance.add($('#' + htmlName));
//			}
   		}
    }
    catch (err) {
    	console.log("updateVideo - " + htmlName + " - " + err.message);
    }
}

function configureVideo(htmlName, newHtmlName, volumeParam, autoHideParam, carryOnParam) {
	try {
		var container = getElement(htmlName);
		if (container) {
			container.setAttribute('id', newHtmlName);
		}
		var frame = getElement('if_' + htmlName);
		if (frame) {
			frame.setAttribute('id', 'if_' + newHtmlName);
			
			frame.contentWindow.configureVideo(newHtmlName, volumeParam, autoHideParam, carryOnParam);
		}
	}
	catch (err) {
		console.log("configureVideo - " + newHtmlName + " - " + err.message);
	}
}

function updateUrl(url, containerName, htmlName, transition) {
    try {   	
		if (htmlName != null) {
			createContainer(htmlName, containerName, transition);
//			createContainer(htmlName, containerName, width, height, transition);

	        var myContainer = getElement(htmlName);
            var myFrame = createNewElement('if_' + htmlName, 'iFrame');
//            var myFrame = createNewElement('if_' + htmlName, 'iFrame', width, height);
            myContainer.appendChild(myFrame);
            
    	    var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow : (myFrame.contentDocument.document) ? myFrame.contentDocument.document : myFrame.contentDocument;
    	    myFrame.src = url;
 //    	    myFrameObj.location.href = url;

    	    parent.itemReady(presFrame, htmlName, false, false, false, false, false);    
   		}
    }
    catch (err) {
    	console.log("updateUrl - " + htmlName + " - " + err.message);
    }
}

function createContainer(frameName, containerName, transition) {
    try {   	
        myFrame = getElement(frameName);
        if (myFrame == null) {
            var myDiv = createNewElement(frameName, 'div');
//            var myDiv = createNewElement(frameName, 'div', width, height);

            if (myDiv != null) {
                myDiv.style["overflow"] = "hidden";
//                myDiv.style["visibility"] = "hidden";
                
        		myDiv.style["position"] = "absolute";

        		myDiv.style["left"] = 0;
        		myDiv.style["top"] = 0;
                
                if (transition) {			
                	if (transition.indexOf('zoom') != -1) {
                		myDiv.className = transition;
                	}
                	else {                        
                		myDiv.className = transition + " " + transition + "_hide";
                	}
				}
                
				// myDiv.className = transition;
				                
				// myDiv.addEventListener( 'webkitTransitionEnd',
				// function(){transitionEnd(frameName)}, false );

                document.getElementById(containerName).appendChild(myDiv);
                
				if ($('#' + containerName).hasClass( 'sb-slider' )) {
					var instance = $('#' + containerName).data( 'slicebox' );
					if ( instance ) {
						instance.add($('#' + frameName));
					}
				}
            }
        }
    }
    catch (err) {
    	console.log("createContainer (presentation) - " + frameName + " - " + err.message);
    }
}

//function transitionEnd(elementName) {
//    try {
//        var myElement = document.getElementById(elementName);
//        var className = myElement.className;
//        if (className.contains('hide')) {
//   	        myElement.style["visibility"] = "visible";
//        }
//    }
//    catch (err) {
//    	console.log("hideElement - " + elementName + " - " + err.message);
//    }
//}

function createNewElement(frameName, type, width, height, top, left) {
    try {
    	width = width ? width : '100%';
    	height = height ? height : '100%';
    	
        var myFrame = document.createElement(type);

        if (myFrame != null) {
            myFrame.setAttribute('id', frameName);
            myFrame.setAttribute('name', frameName);

            myFrame.style["width"] = width;
            myFrame.style["height"] = height;

            if (type == "iFrame") {
                myFrame.setAttribute('allowTransparency', true);

            	myFrame.setAttribute("frameBorder", "0");
            	myFrame.setAttribute("scrolling", "no");
            }
        }
        return myFrame;
    }
    catch (err) {
    	console.log("createNewElement - " + frameName + " - " + err.message);
    }
}

function getElement(elementName) {
    try {
        var myElement = document.getElementById(elementName);
        return myElement;
    }
    catch (err) {
        return null;
    }
}

function showElement(elementName) {
	showElement(elementName, 0);
}

function showElement(elementName, attempt) {
    try {
        var myElement = document.getElementById(elementName);

        if (myElement) {
        	var className = myElement.className;

			if (className.indexOf('slide') != -1) {
				var parentId = $('#' + elementName).parent().attr('id');
				if (!$('#' + parentId).hasClass( 'sb-slider' )) {
					var d = 'next', o = 'h';
					
					if (className.indexOf('right') != -1) {
						d = 'prev';
						o = 'h';
					}
					else if (className.indexOf('up') != -1) {
						d = 'prev';
						o = 'v';
					}
					else if (className.indexOf('down') != -1) {
						d = 'next';
						o = 'v';
					}

					$('#' + parentId).slicebox({
						orientation			: o,
						direction			: d
					});
					$('#' + parentId).addClass( 'sb-slider' );
				}

				var instance = $('#' + parentId).data( 'slicebox' );
				if ( instance ) {
					instance.navigate(elementName);
				}
			} else {
				if (className.indexOf(' ') != -1) {
					var transition = className.substring(0, className.indexOf(' '));
				} else {
					var transition = className;
				}

				myElement.className = transition + " " + transition + "_show";
			}
        }
        else if (attempt < 3) {
        	setTimeout("showElement('" + elementName + "', " + attempt++ + ");", 500);
        }
    }
    catch (err) {
    	console.log("showElement - " + elementName + " - " + err.message);
    }
}

function hideElement(elementName) {
    try {
        var myElement = document.getElementById(elementName);
        if (myElement) {
	        var className = myElement.className;
	        
			if (className.indexOf('slide') == -1) {
		        if (className.indexOf(' ') != -1) {
		        	var transition = className.substring(0, className.indexOf(' '));
		        } else {
		        	var transition = className;
		        }
		        
		    	myElement.className = transition + " " + transition + "_hide";
	        }
        }
    }
    catch (err) {
    	console.log("hideElement - " + elementName + " - " + err.message);
    }
}

function addElement(elementName, containerName) {
    try {
        var myElement = document.getElementById(elementName);

        document.getElementById(containerName).appendChild(myElement);
    }
    catch (err) {
    }
}

function destroyElement(elementName, containerName) {
    try {
        var myElement = document.getElementById(elementName);

        if (elementName.charAt(elementName.length - 1) == "v") {
        	// Scripts might not be loaded correctly
        	try {
        		document.getElementById("if_" + elementName).contentWindow.remove();
        	}
        	catch (err) {
            	console.log("remove JWPlayer - " + elementName + " - " + err.message);
        	}
        	
			var instance = $('#' + containerName).data( 'slicebox' );
			if ( instance ) {
				instance.remove($('#' + elementName));
			}
        }
        
    	setTimeout(function() {
          document.getElementById(containerName).removeChild(myElement);          

    	}, 100);
    	
    }
    catch (err) {
    	console.log("destroyElement - " + elementName + " - " + err.message);
    }
}

function setVisible(elementName, visible) {
    try {
        var myElement = document.getElementById(elementName);

        if (visible) {
            myElement.style["visibility"] = "visible";	
        }
        else {
        	myElement.style["visibility"] = "hidden";
        }
    }
    catch (err) {
    	console.log("setVisible - " + elementName + " - " + err.message);
    }
}