{
/* script name: modal dialog crash fix
this script is a workaround for when this error occurs due to a mouseEvent:
" unable to execute script at line 0. After Effects error: can not run a script while a modal dialog is waiting for response. "
EXPLANATION:
There is a problem in After Effects connected with "Modal Dialogs".
A modal dialog is a window, that supresses the rest of the UI until it is closed. Or that is how it should work.
When getting into event handling, specifically mouseEvents, one might run into an issue, where the script crashes because an event was triggered, when the application was in a modal state.
This shouldn't really happen in the first place, because the script-window shouldn't receive any input during a modal state.
I would call this a bug.
Aanyways. After countless tests with error handling and all sorts of debugging voodoo, I came to the conclusion I'd need a workaround.
And I found this solution, that seems to work really well:
- Add a "keydown" eventListener to your window, that checks if a certain key is pressed (for example the shift key). Let's call it the "trigger key".
- If the trigger key is true (pressed), add your mouseEvent handlers to the window/object and it should run smoothly.
- When the trigger key is released, remove the mouseEvent handler again.

This way, most crashes caused by mouseevents should be preventable.

Drawbacks:
- An error could still occur whenever the "keyup" event handler doesn't get a chance to remove the mouseEvent handlers. For example:
- The modal state is entered while the "trigger" key is pressed.
- The user switches window while the "trigger" key is pressed. The mouseEvent handler will remain active.

*/

function safeEventWindow(thisObj){
	var win = thisObj instanceof Panel ? thisObj : new Window('palette',"Modal Dialog Crasher",undefined,{resizable:false})
		win.alignChildren = ['fill','fill']
	var mGrp = win.add('panel',undefined,'PANEL!')
		mGrp.minimumSize = [200,200]
	var btn1 = win.add('button',undefined,"I'm just a button, man.")
		btn1.alignment = ['center','center']
		btn1.onClick = switchText
	var txt1 = mGrp.add("StaticText",undefined,"\\^___________^/")
		txt1.alignment = ['center','center']
		txt1.hide()

	// FUNCTIONS
	function uiInfo(){
		$.writeln("ui suppressed: ",app.isUISuppressed)
	}
	function switchText(event){
		var state = txt1.visible
		if(state) txt1.hide()
		else txt1.show()
	}

	function mWin_refresh(){
		win.layout.layout(true)
		win.layout.resize()
	}
	
	// EVENT HANDLERS & FUNCTIONALITY
	win.addEventListener("keydown",startMouseListeners)
	win.addEventListener("keyup",stopMouseListeners)

	function startMouseListeners(event){
		var shiftK = event.getModifierState("Shift")
		if(shiftK != true) return;
		mGrp.addEventListener("mouseover",switchText)
		mGrp.addEventListener("mouseout",switchText)
	}
	function stopMouseListeners(event){
		var shiftK = event.getModifierState("Shift")
		if(shiftK != false) return;
		mGrp.removeEventListener("mouseover",switchText)
		mGrp.removeEventListener("mouseout",switchText)
	}

	function stopAllListeners(){
		win.removeEventListener("keydown",startMouseListeners)
		win.removeEventListener("keyup",stopMouseListeners)
		mGrp.removeEventListener("mouseover",switchText)
		mGrp.removeEventListener("mouseout",switchText)
	}
	
	win.onResizing = mWin_refresh

	//__INIT__
	if(win instanceof Window){
		win.show()
		win.center()
	}
	mWin_refresh()
}

//__INIT__
safeEventWindow(this)

}