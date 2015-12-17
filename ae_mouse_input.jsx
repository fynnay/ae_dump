{
// AE mouse input

function ae_mouse_input_tester(thisObj){
	//== GUI ==//
	function GUI(thisObj){
		var builder = thisObj instanceof Panel ? thisObj : new Window("dialog", "Background Renderer", undefined,{borderless:false}, {resizable:true}) ;
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

		//-- EVENT HANDLERS --//
		//- Main Window
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
		mWin.addEventListener("scrollwheel",function(event){
			log.text = event
		})
		//- Scrollbar
		scrl.onChange = function(){
			log.text = scrl.value
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