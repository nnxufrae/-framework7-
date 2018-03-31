var router = {
	init: function() {
		var that = this

		$$(document).on('pageBeforeInit', function(e) {
			var page = e.detail.page
			router.pageBeforeInit(page)
		})

		$$(document).on('pageAfterAnimation', function(e) {
			var page = e.detail.page
			router.pageAfterAnimation(page)
		})
	},
	pageAfterAnimation: function(page) {
		var that = this
		var name = page.name
		var from = page.from
		var query = page.query || util.getRequest()
		$$(".toolbar_init").removeClass("active");
		switch(name) {
			case 'index':
				indexObj.show(query);
				break;


		}
	},
	pageBeforeInit: function(page) {
		var that = this;
		var name = page.name
		var from = page.from
		var query = page.query || util.getRequest();

		switch(name) {
			case 'index':
				indexObj.init(query);
				break;

		}
	}
}