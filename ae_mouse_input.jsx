{
// AE mouse input

function ae_mouse_input_tester(thisObj){
	//== GUI ==//
	function GUI(thisObj){
		var builder = thisObj instanceof Panel ? thisObj : new Window("dialog", "Background Renderer", undefined,{borderless:false}, {resizable:true}) ;
			//builder.orientation = 'stack'
		builder.onResizing = function(){
			builder.layout.layout(true)
			builder.layout.resize();
		}
		//-- USER INTERFACE --//
		var mWin = builder.add('group')
			mWin.orientation = 'column'
			mWin.size = [250,250]
			mWin.alignChildren = ['center','center']
		var btn1 = mWin.add('button',undefined,'button 1')
		var btn2 = mWin.add('button',undefined,'button 2')
		var scrl = mWin.add('scrollbar',undefined)
			scrl.alignment = ['fill','bottom']
		var log = mWin.add('StaticText',undefined,"console")
			log.alignment = ['fill','bottom']
		var sLink = builder.add('scrollbar')
			sLink.alignment = 'fill'
			sLink.minValue = 0
			sLink.maxValue = 100

		//-- EVENT HANDLERS --//
		//- Main Window
		// keyboard listener
		builder.addEventListener("keydown", keyPress, true);
		function keyPress(event){ log.text = event }
		// what's under the cursor
		mWin.addEventListener("mouseover",function(event){
			var target = event.target.toString()
			log.text = "target: "+target
		})
		// mouse button pressed
		mWin.addEventListener("mousedown",function(event){
			var mb = event.button
			switch (mb){
				case 0:
					log.text = "LMB v"
					break;
				case 1:
					log.text = "MMB v"
					break;
				case 2:
					log.text = "RMB v"
					break;
				default:
					log.text = mb
			}
		})
		// mouse button released
		mWin.addEventListener("mouseup",function(event){
			var mb = event.button
			switch (mb){
				case 0:
					log.text = "LMB ^"
					break;
				case 1:
					log.text = "MMB ^"
					break;
				case 2:
					log.text = "RMB ^"
					break;
				default:
					log.text = mb
			}
		})
		// mouse wheel NOT WORKING!!!!
		mWin.addEventListener("mousewheel",function(event){
			log.text = event
		})
		//- Scrollbar
		scrl.onChange = function(){
			log.text = this.event
		}
		sLink.onChange = function(){
			log.text = this.value
			scrl.value = this.value
		}
		return builder;
	}

	var gui = GUI(thisObj)
	if (gui instanceof Window){
		gui.show()
		gui.center()
	}
}
ae_mouse_input_tester(this)
}