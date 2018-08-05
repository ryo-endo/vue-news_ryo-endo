

const ApiBaseUrl = "https://api.nytimes.com/svc/topstories/v2/"
const ApiKey = "8aaaef35bd1b4b509c9ac03b5c14790c"

function buildUrl(section) {
    return ApiBaseUrl + section + ".json?api-key=" + ApiKey
}

const vm = new Vue({
    el: '#app',
    data: {
        results: []
    },
    mounted () {
        this.getPosts('world');
    },
    methods: {
        getPosts(section) {
            axios.get(buildUrl(section))
                .then(response => {this.results = response.data.results})
                .catch(error => console.error(error))
        }
    },
    computed: {
        processedPosts () {
            let posts = this.results;

            posts.map(post => {
                let imgObj = post.multimedia.find(media => media.format === 'Normal');
                post.image_url = imgObj ? imgObj.url : "";
            });

            // 4つごとにまとめる
            let i, j;
            let chunkedArray = [];
            let chunk = 6;
            for (i = 0, j = 0; i < posts.length; i += chunk ,j++) {
                chunkedArray[j] = posts.slice(i, i + chunk);
            }

            return chunkedArray;
        }
    }
});