#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
lessc metroui.less > ./../css/metroui.css
lessc themes.less > ./../css/metroui.themes.css