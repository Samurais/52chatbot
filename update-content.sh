#! /bin/bash 
###########################################
# Update Content from dist folder
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
# functions

# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $baseDir/dist
tar cf - . | (cd $baseDir;tar xf -)

cd $baseDir
git add --all
git commit -m "#2 update content"
git push origin master
