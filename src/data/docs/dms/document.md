## Add document

First open Open `data.js` file

Add this javascript code

``` javascript
project.add(projectId, projectName)
    .addDoc(docId, docName, category, options)
```


### Parameters

| Parameter | Type | Description | Remark |
| --------- | ---- | ----------- | ------ |
| docId     | string | A unique document Id for this project | Required |
| docName   | string | Display string for document | Required |
| category | string | A valid category name for grouping (keep empty for no group) | |
| options | object | Options have all other properties for document (see below table) | &nbsp; |


#### Options

| Options name | Type | Descriptions |
| ------------ | ---- | ------------ |
| fileName | string | A file name if docId and fileName are different |
| tags | string | Comma separated tags for searching content  |
| noDoc | boolean | If we don't have document right now we mark as noDoc and this show in red color |
| noList| boolean | If we don't want to add document in navigation list we mark as noList |

