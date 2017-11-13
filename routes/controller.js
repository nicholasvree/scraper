var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");


module.exports = function(app) {

//Route for sraping the site
	app.get("/scrape", function(req, res) {
		axios.get("http://www.chicagobusiness.com/news/technology").then(function(response) {
			var $ = cheerio.load(response.data);

			$("article").each(function(i, element) {
				var result = {};

				result.title = $(this)
				.children("h2")
				.children("a")
				.text();
				result.link = $(this)
				.children("h2")
				.children("a")
				.attr("href");
				result.summary = $(this)
				.children("p")
				.text()


				db.Article
				.create(result)
				.then(function(dbArticle) {
					res.send('true')
				})
				.catch(function(err) {
					res.json(err);
				});
			});
		});

	});

	// Route for getting all Articles from the db
	app.get("/", function(req, res) {
		db.Article
		.find({})
		.then(function(dbArticle) {
			var hbsObject = {article: dbArticle}
			res.render("articles", hbsObject);
		})
		.catch(function(err) {
			res.json(err);
		});
	});

	// Route for grabbing a specific Article by id, populate it with it's note
	app.get("/api/articles/:id", function(req, res) {
		db.Article
		.findOne({ _id: req.params.id })
	    .populate("note")
	    .then(function(dbArticle) {
	    	res.json(dbArticle);
	    	console.log(dbArticle)
	    })
	    .catch(function(err) {
	    	console.log(err)

	    	res.json(err);
	    });
	});

	// Route for saving/updating an Article's associated Note
	app.post("/api/articles/:id", function(req, res) {
		console.log(req.body)
		db.Note
		.create(req.body)
		.then(function(dbNote) {
			return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: {note: dbNote._id }}, { new: true });
		})
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
	});

		// Route for saving/updating an Article's associated Note
	app.post("/api/delete/:id", function(req, res) {

		console.log("article", req.params.id)

		console.log("note", req.body._id)

		db.Article.findOneAndUpdate({ _id: req.params.id }, {$pull: {note: req.body._id }})
		.then(function(dbArticle) {
			console.log(dbArticle)
			res.json(dbArticle);
		})
		.catch(function(err) {
			// console.log(err)
			res.json(err);
		});
	})
}
