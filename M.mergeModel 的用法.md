/**
  * M.mergeModel(model, conf) 的语法
  * - 参数:model 需要被改变的对象
  * - 参数:conf 做什么样的改变, 需要传入一个对象
  *   - conf 中左侧属性名来定位到 model 中哪一个属性, 右侧的值来给这个属性赋值
  *   - conf 的属性名的解析规则, 可以使用 '.', '[]' 来定位
  *    - '.' 操作符
  *      (1.1) 如果对一个 Object 使用 '.xxx', 则去定位这个对象的 xxx 属性;
  *      (1.2) 如果对一个 Array 使用 '.xxx', 则去定位这个数组中某一个元, 这个元必须是一个 Object, 并且这个 Object 的 code 是 xxx;
  *    - '[]' 操作符
  *      (2.1) 如果对一个 Array 使用 '[x]', 则去定位这个数组中第 x 下标的元
  *
  * 例如:
  * M.mergeModel(model, {
  *     "forms.baseInfo.fields.color.range": newRange,
  * });
  * 请打开 mtf.block > bill > demo > app > model.js 来看, 以下是解析步骤,
  * 第一步, 配置中第一个操作符左边的属性是 forms, 根据 1.1 规则去定位到 model 中 forms 属性
  * 第二步, 第一步定位到的是一个数组, '.baseInfo' 根据 1.2 规则去定位到 forms 数组中一个 code 为 baseInfo 所在的元
  *    (ps: 此处可以使用 forms[0] 来代替即 2.1 规则, 但建议使用 1.2 规则去处理, 防止我们对 forms 中的元挪动位置影响它的有效性 )
  * 第三步, 第二步定位到的是一个对象, '.fields' 根据 1.1 规则去定位到 baseInfo 这个元对象中的 fields 数组
  * 第四步, 第三步定位到的是一个数组, '.color' 根据 1.2 规则去定位到 fields 数组中一个 code 为 color 所在的元
  * 第五步, 第三步定位到的是一个对象, '.range' 根据 1.1 规则去定位到这个对象中的 range 属性; 如果对象中没有这个 range 属性, 则进行创建
  * 第六步, 将第五步定位到的 range 属性赋值为 newRange, 此时已完成 model 的更新, 再次 render (渲染)时 Bill 将会获取到新的 model 去渲染
  **/
  
  ### utils 的问题点
  
  -  template 中cache?
  -  HashPrefix 做什么用?
  -  reactExtras 作用?
  -  promisify 的作用