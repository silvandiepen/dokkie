Vue.config.delimiters = ["${", "}"];
new Vue({
	el: "#search",
	data: {
		searchTerm: "",
		show: false,
		initialized: false,
		posts: [],
	},
	methods: {
		initSearch() {
			this.show = true;
			if (!this.initialized)
				fetch("/data.json")
					.then((response) => response.json())
					.then((json) => {
						this.initialized = true;
						this.posts = json;
					});
		},
	},
	computed: {
		filteredPosts() {
			if (!this.posts.length || this.searchTerm == "") return [];
			return this.posts.filter((item) =>
				item.data.toLowerCase().includes(this.searchTerm.toLowerCase())
			);
		},
	},
});
