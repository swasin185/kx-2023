basedir=/khgroup/nodeapps
pm2 stop $basedir/$1/Server.js
rm -R $basedir/$1
unzip /khserver-data/kxserv/dist.zip -d $basedir
mv $basedir/dist $basedir/$1
cd $basedir/$1
APIHOST=$1 pm2 start Server.js --name $1
