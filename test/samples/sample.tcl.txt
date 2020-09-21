proc find {{basedir .} {filterScript {}}} {
    set oldwd [pwd]
    cd $basedir
    set cwd [pwd]
    set filenames [glob -nocomplain * .*]
    set files {}
    set filt [string length $filterScript]
    foreach filename $filenames {
        if {!$filt || [eval $filterScript [list $filename]]} {
            lappend files [file join $cwd $filename]
        }
        if {[file isdirectory $filename]} {
            set files [concat $files [find $filename $filterScript]]
        }
    }
    cd $oldwd
    return $files
}
