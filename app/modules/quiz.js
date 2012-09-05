(function(Quiz) {

	Quiz.Model = Backbone.Model.extend({
		initialize : function() {
			//
		}
	});

	Quiz.Error = Backbone.Model.extend();

	Quiz.Collection = Backbone.Collection.extend({
		model: Quiz.Model,
		url: "app/quiz-json.js"
	});

	Quiz.Errors = Backbone.Collection.extend({
		model: Quiz.Error
	});

	Quiz.Foo = new Quiz.Collection;
	Quiz.Bar = new Quiz.Errors([
		{err: 1, msg: "You need to choose an answer, fool!"}
	]);

	Quiz.Answer = "";

	Quiz.Router = Backbone.Router.extend({ /* ... */ });

	Quiz.Views.Home = Backbone.View.extend({

		initialize: function() {
			var view = this;
		Quiz.Foo.fetch({
			success:function(){
				// collection initialized
				view.render(function(el) {
					$("#main").html(el);
				});
			}
		});
		},

		template: "app/templates/home.html",

		vars: {},

		render: function(done) {
			if(Quiz.Foo.length >0) {
				var view = this,
					model = Quiz.Foo.at(0);
				this.vars.title = model.get("title");
				this.vars.description = model.get("description");
				this.vars.img = model.get("img");
				myQuiz.fetchTemplate(
					this.template, 
					function(tmpl) {
						view.el.innerHTML = tmpl;
						done(view.el);
					},
					view.vars
				);
			}
		}
	});

	Quiz.Views.Quiz = Backbone.View.extend({
		template: "app/templates/quiz.html",

		vars: {},

		model: Quiz.Foo.at(0),

		events: {
			"submit #quiz": function(e) {
				e.preventDefault();

				// make sure something was checked
				var answer = $('#quiz [name="quiz-answer"]:checked');
				if(answer.length > 0) {
					Quiz.Answer = $('#quiz [name="quiz-answer"]:checked').val();
					myQuiz.app.router.navigate("#/results", true);
				}
				else {
					var err = new Quiz.Views.QuizError();
					err.render(function(el) {
						$("#quiz").append(el);
					});
				}
		 	}  
		},

		render: function(done){
			var view = this,
				model = Quiz.Foo.at(0);
			
			this.vars.title = model.get("title");
			this.vars.question = model.get("question");
			this.vars.answers = model.get("answers");
			this.vars.button = model.get("button");

			myQuiz.fetchTemplate(
				this.template, 
				function(tmpl) {
					view.el.innerHTML = tmpl;
					done(view.el);
				},
				view.vars
			);
		}
	});

	Quiz.Views.QuizError = Backbone.View.extend({
		template: "app/templates/quizerror.html",

		vars: {},

		render: function(done){
			var view = this,
				model = Quiz.Bar.at(0);
			this.vars.msg = model.get("msg");

			myQuiz.fetchTemplate(
				this.template, 
				function(tmpl) {
					view.el.innerHTML = tmpl;
					done(view.el);
				},
				view.vars
			);
		}
	});

	Quiz.Views.Results = Backbone.View.extend({
		template: "app/templates/results.html",
		
		vars: {},
		
		render: function(done){
			var view = this,
				id = Quiz.Answer,
				model = Quiz.Foo.at(0),
				responses = model.get("responses");
			
			this.vars.title = model.get("title");
			for(r in responses){
				if(responses[r]['id'] === id) {
					this.vars.response = responses[r];
				}
			}

			myQuiz.fetchTemplate(
				this.template, 
				function(tmpl) {
					view.el.innerHTML = tmpl;
					done(view.el);
				},
				view.vars
			);
		}
	});

})(myQuiz.module("quiz"));