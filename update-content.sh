#! /bin/bash 
###########################################
# Update Content from dist folder
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
# functions

# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $baseDir
npm run build
if [ $? -eq 0 ]; then
    git add --all
    git commit -m "#2 update develop"
    git checkout master
    cd $baseDir/dist
    tar cf - . | (cd $baseDir;tar xf -)
    cd $baseDir
    git add --all
    git commit -m "#2 update master content"
    git push origin master
    git checkout develop
    git push origin develop
else
    echo "exit with error."
fi
