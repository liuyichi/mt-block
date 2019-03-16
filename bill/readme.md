## bill的使用说明 

### 新bill的使用方法

bill 用es5来写 便于调试和阅读

props 可以传入什么

```
    model : 显示的配置
    data : 显示需要的数据
    dataFactory : 数据集、fetch、profile获取数据等获取数据的数据工厂；默认还走系统配置的,可以控制传完整的url;
    validateFactory : 校验工厂 某个字段需要发生改变是进行校验的校验工厂
    elementFactory : 组件工厂自定义组件显示的组件工厂,返回的是React.createClass()
    actionFactory : 变更工厂 字段发生改变时需要执行相应行为的行为工厂
    tipFactory: 提示工厂 获取字段键入是提示信息 

```

```

<NodeBill
	ref = "bill"
	model = {}
	data = {}
	dataFactory = {}
	validateFactory = {}
	elementFactory = {}
	actionFactory = {} 
/>	

```

## field model 

* text autoText number textarea

```
    //旧的model是这样的 
    {
      "code":"appCode",
      "name":"编码",
      "pattern":"^[0-9a-zA-Z_]{1,30}$",
      "show":true,
      "type":"text",
      "required":true,
      "validation":"不能为空，只能使用5-30个下划线、字母和数字"
    }
    // number 多step\min\max 3个属性
    // textarea 多一个rows属性
    // autoText 如下配置
    { 
        code: "autoText",
        name: "autoText",
        type: "autoText",
        show: true,
        defaultValue: "",
        required: true,   //是否必填
        readonly: false,  //是否只读
        placeholder: "请输入内容",  //输入框中的预提示
        model: {
            height: 200,  //下拉弹框的最大高度
            size: 20,      //下拉框中最多显示多少条数据,默认是展示所有
        },  //autoText列表的配置
        validation: "不能为空",  //校验失败时显示的无效提示
    }
    //新的model 会是这样的
    {
      "code":"text_code",
      "name":"输入框编码",
      "type":"text",
      "show":true,
      "mode":"default",
      "readonly":false,
      "tooltip":"这是一个不能为空的输入框",
      "conf":{
        "showHeader":true,
        "alignment":"left",
        "trigger":"onBlur",
        "htmlType":"text", //input类型的专用
        "validator":{
          "onBlur":[
            {
                "required":true,
                "whitespace":true,
                "message":"必填项必须输入"
            },
            {
                "pattern":"^[a-zA-Z1-9_]{1,8}$",
                "message":"特殊字符不认识哦"
            }
          ],
          "onChange":[
            {"validator":true}
          ]
        },
        "step":0.01, // number 类型最小步数
        "min":10, // number 类型最小值
        "max":20,// number 类型最大值
        "rows":3 //textarea 类型默认行数
      }
    }

```

* date 

```
    //旧的model
    { 
        code: "date",
        name: "date",
        type: "date",
        show: true,
        defaultValue: "",
        required: true,   //是否必填
        readonly: false,  //是否只读
        placeholder: "请选择时间",  //输入框中的预提示
        format: "yyyy-mm-dd hh:MM:ss",  //时间的格式
        validation: "不能为空", //校验失败时显示的无效提示
    }
    //新的配置
    {
          "code":"date",
          "name":"请选择日期",
          "type":"text",
          "show":true,
          "mode":"default",
          "readonly":false,
          "defaultValue":true,//当defaultValue为true 显示为当前日期 其他以传入的为准
          "required":true,
          "validation":"必填项必须输入"
          "conf":{
              "showHeader":true,
              "alignment":"left",
              "validator":true, //配置为true时 走自定义校验
              "format":"yyyy-MM-dd", // 通过format来控制显示 年月  年月日  年月日时分秒
              "disabledDate":"less" // less表示小于now的时间不能选 more表示大于now的时间不能选 也可以是自定义方法
          }   
    }

```


## validate

model 中的validate会是这样的

```
    validator:{
                "onBlur":[{required:true,whitespace:true,message:"真不打算写点什么?"}],
                "onChange":[{pattern:"^[0-9a-zA-Z_]{1,30}$",message:"只能使用5-30个下划线、字母和数字"},{validator:true}]
            }
```

## 已经写的组件

* mt-input  √
