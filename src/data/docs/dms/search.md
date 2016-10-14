### Search

We have three options for search

1. Project search
2. Document search by its name or tags
3. Document search by its name or tags with content

#### 1. Project search

To find or filter project type any keywords in search box in [project listing screen](/docs)

#### 2. Document search by its name or tags

To find some document we have two options

1. Inside project
2. Global search

##### 1. Inside project

* Click on any project in [proejct listing screen](/docs)
* We can see search box in top right corner
* Type any keyword in search box, we will get search result

##### 2. Global search

* Click on `Search document` button in [project listing screen](/docs)
* Type any keyword in search box and click on search icon button


#### 3. Document search by its name or tags with content

* Click on `Search document` button in [project listing screen](/docs)
* Type any keyword in search box, check `Search in content` and click on search icon button

<div class="alert alert-warning">
Search inside document content is slower then normal search, its fetch all document first and search inside document.
It will make cache for search faster for next time.
To change cache limit we can change this value in `config.js` file, which stored in `searchCacheExpiry` field in seconds. Default value is 1 hours
</div>

<div class="alert alert-info">
On adding doc in `data.js` we can set tags of document for quick searching.
</div>

#### Add keywords to exclude from search

Some keywords are grammar word which are not a searching word,
we can avoid that words to including search result by add that keywords using below syntax in `data.js` in top.

``` js
Project.addNonWords('a,an,is,are,for');
```

