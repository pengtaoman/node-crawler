const phantom = require('phantom');
var phantomProxy = require('phantom-proxy');


const url = 'https://medium.com/_/api/topics/22d054b693da/stream?limit=25&to=1504625051983?format=json'

///////// export http_proxy=socks5://127.0.0.1:1086;export https_proxy=socks5://127.0.0.1:1086;
var crawler = async function  () {
  this.instance = await phantom.create([], {
    logLevel: 'info',
    parameters: { 'proxy': 'socks5://127.0.0.1:1086' }
  });
  this.page = await this.instance.createPage();
  const status = await this.page.open(url);
  var indexJson;
  if (status === "success") {
    const content = await this.page.property('content');
    const tmp = content.replace('<html><head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">])}while(1);&lt;/x&gt;', '');
    indexJson = tmp.replace('</pre></body></html>', '');//这里去掉前后浏览器自动加上的tag
  } else {
    console.log("runIndex 网页加载失败");
  }

  const articleList = [];
  const items = indexJson.payload.streamItems[0].section.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const postId = item.post.postId;
    const post = indexJson.payload.references.Post[postId];
    const User = indexJson.payload.references.User;

    let homeCollection = 'null';
    if (post.homeCollectionId) {
        const collection = indexJson.payload.references.Collection[post.homeCollectionId];
        homeCollection = collection.domain ? collection.domain : collection.slug
    }
    const articleParams = {
        postId: postId,
        title: post.title,
        creator: User[post.creatorId].username,
        homeCollection: homeCollection,
        subtitle: post.content.subtitle,
        previewImage: post.virtuals.previewImage.imageId,
        totalClapCount: post.virtuals.totalClapCount,
        uniqueSlug: post.uniqueSlug,
        detailUrl: this.getDetailUrl({
            homeCollection: homeCollection,
            uniqueSlug: post.uniqueSlug,
            creator: User[post.creatorId].username
        }),
        publishTime: post.latestPublishedAt,
        createdTime: new Date().getTime()
    }
    articleList.push(articleParams);
  };
}

crawler();



function getDetailUrl (params) { // 组装详情页链接方法
  let pre = 'medium.com';
  if (params.homeCollection) {
    if (params.homeCollection.includes('.')) {
        pre = params.homeCollection;
    } else if (params.homeCollection == 'null') {
    pre += '/@' + params.creator;
    }
  } else {
      pre += '/' + params.homeCollection;
  }
  return `https://${pre}/${params.uniqueSlug}`
}