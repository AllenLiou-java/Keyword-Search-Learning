var post_api_url = "http://awiclass.monoame.com/api/command.php?type=get&name=post";
var app = Vue.createApp({
    data() {
        return {
            posts: [],
            filter: "",
        }
    },
    mounted() {
        const vobj = this;
        $.get(post_api_url).then(function(res) {
            // 若直接使用this，則並非指向data，故須在外層先宣告vobj = this
            // 記得要將資料先轉成物件格式
            vobj.posts = JSON.parse(res);
        })
    },
    computed: {
        filtered_post() {
            var vobj = this;
            return this.posts.map(function(post) {
                // 深層拷貝以供後續資料處理使用而不改變到原資料
                var temp_post = JSON.parse(JSON.stringify(post));
                temp_post.description = temp_post.description.substr(0,60);
                
                return temp_post;
            }).filter(function(post) {
                //因為過濾的內容包含title、description、name_cht，故透過forEach重複比對此三個對象內容
                var tag = ["title", "description", "name_cht"];
                var flag = false;
                tag.forEach(function(now_tag) {
                    if(post[now_tag].toLowerCase().indexOf(vobj.filter.toLowerCase()) != -1) {
                        // return true;
                        flag = true;
                    }
                })
                // return false;
                return flag;
            }).map(function(temp_post) {
            
                if(vobj.filter == "") return temp_post;
                // replace方法回傳一個新字串，原始字串不變
                
                var tag = ["title", "description", "name_cht"];
                tag.forEach(function(now_tag) {
                    // 使用match() 方法將符合正規表達式的原內容回傳
                    var match_word = temp_post[now_tag].match(new RegExp(vobj.filter,"i"));
                    temp_post[now_tag] = temp_post[now_tag].replace(new RegExp(vobj.filter,"i"), "<span class='highlight'>"+ match_word +"</span>");
                })
                return temp_post;
            })
        }
    }
});

app.component('postbox', {
    template: '#post',
    props: ["post"],
    computed: {
        coverurl() {
            // 透過indexOf來比對該字串是否包含http
            if(this.post.cover.indexOf("http")!=-1) {
                return this.post.cover;
            }else {
                return "https://zashare.org" + this.post.cover;
            }
        },
        covercss() {
            // 注意此處return物件，物件的key與value皆為字串，故value需使用自串串接方式
            return {
                "background-image": "url(" + this.coverurl + ")"
            };
        }

    }
})

app.mount('#app');