#heroku login
git add .
git commit -m "new commit"
git push heroku main
heroku scale worker=1 web=0
heroku logs