# Project Milestone 2

A simple movie discovery app


# Languages & Frameworks

-Python 3.10.0

-Flask 2.0.2

-TheMovieDB API

-MediaWiki Action API

-PostgreSQL

-Heroku


# Technical Issues

-Redirecting back to movie page after posting comment. Solved by using "redirect(url_for(<name_of_fuction>))" instead of "flask.render_template(<name_of_fuction>)"

-Sumbiting form data. had to update @app.route() so it matchs the "action" on the form

