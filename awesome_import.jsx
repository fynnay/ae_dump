{
function awesomeImport(fold){
// recursively go through all files and folders in a folder and import video as video and framestacks as sequences
    // VARIABLES
    var files = fold instanceof Folder ? fold.getFiles() : Folder(fold).getFiles()
    

    // __I N I T__
    // remove hidden files
    var i = 0;
    for(;i<files.length;){
        var curFile = files[i]
        if(curFile.hidden){
            files.splice(i,1)
        }else{
            i++;
        }
    }

    i = 0;
    for(;i<files.length;){
        var curFile = files[i]
        var curFileNom = decodeURIComponent(curFile.name) // get filename and remove %20, where there should be spaces
        var impOpt = null ;
        var offset = 0; // whenever a files is removed this is incremented by 1
        
        if(curFile instanceof Folder){
            $.writeln("R E C U R S I O N: ",curFile.name)
            awesomeImport(curFile)  // recursion
        }

        // Check if filetype is supported
        try{
            impOpt = new ImportOptions(curFile)
        }catch(err){
            impOpt = null
        }
        
        // Remove files that are unsupported
        if(impOpt==null){
            $.writeln("unsupported: ",curFileNom)
            files.splice(i,1)
            offset+=1;
        }

        // Remove files, that are not of type FOOTAGE
        if(impOpt!=null && !impOpt.canImportAs(ImportAsType.FOOTAGE)){
            $.writeln("not footage: ",curFileNom)
            files.splice(i,1)
            offset+=1;
        }

        // I M P O R T   F I L E S
        if(impOpt!=null && impOpt.canImportAs(ImportAsType.FOOTAGE)){
            // check for incrementing numbers in filename
            /*

            pattern explained:
            /[^\D][0-9]+(?=\.[a-z]+$)/i;
            "zero or more non-digits,at least one number,dot,followed by at least one letter,ends with letters"/case insensitive

            e.g.:
            Screen Shot 2015-10-02 at 23.47.10045.png
            returns  10045
            Comp 1.mov
            returns null
            
            see this site for syntax: http://www.w3schools.com/jsref/jsref_obj_regexp.asp
            */
            var patt = /[^\D]*[0-9]+(?=\.[0-9a-z]+$)/i;               // see above for explanation of pattern
            var seqCheck = false;
            var intCheck = parseInt(patt.exec(curFileNom),10);     // Run the RegExp "patt" and remove leading zeros. This is to check if the 5 files have incrementing numbers.
            $.writeln("initial rxResult:",intCheck)
            if(intCheck!=null){
            // If a pattern has been detected, check if the next 4 files also have the pattern.
                //$.writeln("rxResult: ",intCheck)
                var x = i+1; // start at next file
                for(;x<files.length && x<i+10;){                        // Check if the next five files are related.
                    var seqFileNom = decodeURIComponent(files[x].name) // Get filename with extension and remove %20, where there should be spaces. Getting it with extension makes it easier to finde the frame number if there is one.
                    var rxResult = parseInt(patt.exec(seqFileNom),10)  // Run the RegExp "patt" and remove leading zeros.
                    if(rxResult!=null && x==i+10 && intCheck-rxResult==-1){       // Check if this file increments the previous one by 1.
                        seqCheck = true
                        intCheck = rxResult;
                    }else{
                        seqCheck = false;
                        break;
                    }
                    x+=1;
                }
            }
            
            $.writeln("importing: ",curFileNom)
            if(seqCheck == true){
                impOpt.sequence = true ;
                impOpt.forceAlphabetical = true;
                try{
                    var impFile = app.project.importFile(impOpt)
                    var fps = impFile.frameRate
                    var dur = impFile.duration
                    var frames = fps*dur
                    i+=frames-1; // skip all files that where part of the sequence minus the current one
                }catch(err){
                    impOpt.sequence = false;
                    impOpt.forceAlphabetical = false;
                    app.project.importFile(impOpt)
                }
            }else{
                try{
                    app.project.importFile(impOpt)
                }catch(err){
                    $.writeln(err)
                }
            }
        }
        
        i+= (1-offset);  // increment by 1 minus the number of files removed to avoid skipping files
    }

}

var uInput = Folder.selectDialog("choose a folder in which too look for footage to import.")
awesomeImport(uInput)

}