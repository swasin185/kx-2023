git -C $1 add . 
git -C $1 commit -m "x$2"
git -C $1 push -v
