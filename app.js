

const ApiBaseUrl = "https://api.nytimes.com/svc/topstories/v2/"
const ApiKey = "8aaaef35bd1b4b509c9ac03b5c14790c"
const SECTIONS = "home,world,technology,arts"

function buildUrl(section) {
    return ApiBaseUrl + section + ".json?api-key=" + ApiKey
}

Vue.component('news-list', {
    props: ['results'],
    template: `
        <section>            
            <div class="row" v-for="posts in processedPosts">
                <div class="columns medium-2" v-for="post in posts">
                    <div class="card">
                        <div class="card-divider">
                            {{post.title}}
                        </div>
                        <img :src="post.image_url"></img>
                        <div class="card-section">
                            <p>{{post.abstract}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `,
    computed: {
        processedPosts () {
            let posts = this.results;

            posts.map(post => {
                let imgObj = post.multimedia.find(media => media.format === 'Normal');
                post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
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

const vm = new Vue({
    el: '#app',
    data: {
        results: [],
        sections: SECTIONS.split(','),
        section: 'home'
    },
    mounted () {
        this.getPosts(this.section);
    },
    methods: {
        getPosts(section) {
            axios.get(buildUrl(section))
                .then(response => {this.results = response.data.results})
                .catch(error => console.error(error))
        }
    }
});