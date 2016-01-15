## Add category

First open Open `data.js` file

Add this javascript code

```
Project.add(projectId, projectName)
    .addCategory(name, displayText)
```


### Parameters

| Parameter   | Type | Description | Remark |
| ----------- | ---- | ----------- | ------ |
| name        | string | A unique category name | Required |
| displayText | string | Display string for category which was display in list | Required |
