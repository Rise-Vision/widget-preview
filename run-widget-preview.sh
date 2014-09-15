platform='unknown'
unamestr=`uname`
if [[ "$unamestr" == 'Linux' ]]; then
   build/rv-widget-dev-app/linux32/nw --remote-debugging-port=9222
elif [[ "$unamestr" == 'Darwin' ]]; then
   open build/rv-widget-dev-app/osx/node-webkit.app
fi
