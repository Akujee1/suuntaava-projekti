#heroku login
git add .
git commit -m "new commit"
git push heroku master
heroku scale worker=1 web=0
heroku logs