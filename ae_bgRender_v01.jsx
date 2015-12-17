{
// AE background renderer panel 
/*
This small script creates a panel with a button and a slider:
- button: [Background Render]
- slider: |----------[]-----| % RAM used

Upon pressing the button the current items in the render queue will be rendered in the background.
Neat.
*/
function ae_backgroundRender(thisObj){
    var debug = false;
    var os_name = system.osName
    var ae_version = app.buildName.slice(0,4)
    var ae_install_path = Folder(Folder.appPackage).parent.fsName
    $.writeln('ae_install_path: ',ae_install_path)
    var script_file_path = (File($.fileName)).path
    var script_version = 1.0
    var thisProj = File(app.project.file).fsName;
    var RQ = app.project.renderQueue
    //== MAC OS METHODS ==//
    function osx_Render_RQ(){
        app.project.save();
        function str(inp){
            return '"'+String(inp)+'"';
        }
        var aePath = ae_install_path.toString()+"/aerender";
        var prjPath = thisProj.toString();                          //path to After Effects [version]/aerender
        var system_run = "osascript -e' \n"                         //current project's ~/path/filename.aep
            system_run+= 'tell application "Terminal" \n'           //pass the following to Terminal
            system_run+= 'set aePath to'+str(aePath)+"\n"           //set path of aerender, enclosed in double quotes
            system_run+= 'set aeRender to quoted form of aePath\n'  //convert path so AppleScript passes it to the terminal it correctly
            system_run+= 'set arg to " -project" \n'                //aerender flag
            system_run+= 'set prjPath to '+str(prjPath)+"\n"        //set path of project, enclosed in double quotes
            system_run+= 'set proj to quoted form of prjPath \n'    //convert path so AppleScript passes it to the terminal it correctly
            system_run+= 'set cmd to aeRender & arg & " " & proj\n' //combine stuff to form command to be run in terminal
            system_run+= ' do script cmd \n'                        //run the cmd
            system_run+= " end tell'"                               //end of AppleScript
        app.project.save();
        var call = system.callSystem(system_run)                    //pass the system_run to the Terminal
        $.writeln(call)
        return call;
    }
    function osx_Cancel_RQ(){
        // quits the terminal
        var call = system.callSystem('killall Terminal')
        return call;
    }

    //== WIN METHODS ==//
    function win_Render_RQ(){
        //app.project.save()
        function str(inp){
            // stringify something in strong quotes
            return '"'+String(inp)+'"' ;
        }
        var aePath = ae_install_path.toString()+"\\aerender";
        var prjPath = thisProj.toString();                          //path to After Effects [version]/aerender
        $.writeln('aePath: ',aePath)
        $.writeln('prjPath: ',prjPath)
        //alert('Windows not yet supported.')
    }
    function win_Cancel_RQ(){
        // quits the command line
        var call = system.callSystem('taskkill /IM cmd.exe')
        return call;
    }

    // __INIT__ //
    function gogogogo(mem){
        // checks if everything is okay
        // if yes, run background Render with memory limit defined by slider
        if(!gAECommandLineRenderer instanceof Object){              // check if the command line renderer provided by Adobe exists
            alert("Sowwy...\nThis script won't run on this installation of After Effects.")
        }else{
            try{
                if(thisProj.displayName=="null"){                              // is the project saved?
                    alert("Project needs to be saved to continue\nPlease save the project and try again.")
                }else{
                    os_name = os_name.toLowerCase()                 // which system is this?
                    if(os_name=="macos"){                           // Mac
                        write('Starting Terminal')
                        osx_Render_RQ()
                    }else{                                          // Windows
                        write('Starting Command Line')
                        win_Render_RQ()
                    }
                }
            }catch(err){
                $.writeln("Line ",err.line,": ",err)
            }
        }
    }
    function stop_it(){
        if(!gAECommandLineRenderer instanceof Object){              // check if the command line renderer provided by Adobe exists
            alert("Sowwy...\nThis script won't run on this installation of After Effects.")
        }else{
            try{
                os_name = os_name.toLowerCase()                 // which system is this?
                if(os_name=="macos"){                           // Mac
                    write('Starting Terminal')
                    osx_Cancel_RQ()
                }else{                                          // Windows
                    write('Starting Command Line')
                    win_Cancel_RQ()
                }
            }catch(err){
                $.writeln("Line ",err.line,": ",err)
            }
        }
    }

    function GUI(thisObj){
        var gs = 2 // global spacing for this gui
        var parent = (thisObj instanceof Panel)? thisObj : new Window("dialog", "Background Renderer", undefined,{borderless:false}, {resizable:true}) ;
            parent.onResizing = function(){
                parent.layout.layout(true)
                parent.layout.resize()
            }
        var mWin = parent.add('group')
            mWin.orientation = 'column'
            mWin.preferredSize = [100,50]
            mWin.alignment = ['fill','fill']
            mWin.alignChildren = ['left','top']
            mWin.margins = [0,0,0,0]
        var sGrp = mWin.add('group')
            sGrp.orientation = 'row'
            sGrp.spacing = gs
        var sHead = sGrp.add('StaticText',undefined,'RAM: ')
        var sDispVal = sGrp.add('StaticText',undefined,'0')
            sDispVal.characters = 3
        var sPerc = sGrp.add('StaticText',undefined,"%")
        var slider = sGrp.add('slider')
            slider.minValue = 0
            slider.maxValue = 100
            slider.value = 50
            slider.onChanging = function(){
                sDispVal.text = Math.ceil(slider.value)
            }
            sDispVal.text = slider.value
        var bGrp = mWin.add('group')
            bGrp.orientation = 'row'
            bGrp.alignment = ['fill','top']
            bGrp.alignChildren = ['left','top']
            bGrp.margins = [0,0,0,0]
            bGrp.spacing = gs
        var rBtn = bGrp.add('Button',undefined,"BG Render")
            rBtn.alignment = ['fill','top']
            rBtn.minimumSize = [50,25]
            rBtn.helpTip = "Render all items in the render queue\nin the background (with a memory limit (soon))."
            rBtn.onClick = function(){ gogogogo(slider.value) }
        var rCnclBtn = bGrp.add('Button',undefined,'Cncl Render')
            rCnclBtn.helpTip = (os_name.toLowerCase()=="macos") ? "Quits the Terminal" : "Quits the Command Line"
            rCnclBtn.onClick = function(){
                stop_it()
            }
        return parent
    }

    // open the graphical user interface as either a window or in the AE provided panel from the >Window menu
    var gui = GUI(thisObj) ;
    if (gui instanceof Window){
        gui.show();
        gui.center();
    }
}
ae_backgroundRender(this);
}