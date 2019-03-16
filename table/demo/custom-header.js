import React from "react";
import Table from '../index';
import Icon from '../../icon';
import Input from '../../input';
import _ from 'lodash-compat';
import './customHeader.scss';


const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    favoriteSports: "basketball",
    sex: "boy"
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    favoriteSports: "tennis",
    sex: "gril"
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    favoriteSports: "football",
    sex: "boy"
  }
];

var CustomHeader = React.createClass({
  getInitialState(){
    return {
      keyword: '',
      dropDown: false,
      ageFilterActive: false
    }
  },
  componentDidMount() {
    let { ageHeadContainer } = this.refs;
    window.addEventListener('click', (e) => {
      if (this.state.dropDown && !ageHeadContainer.contains(e.target)) {
        this.controlDropdown();
      }
    });
  },
  fetchData(){
    this.setState({ dropDown: false });
    //控制filterIcon是否高亮
    if( !this.state.ageFilterActive && this.state.keyword != ''){
      this.setState({ ageFilterActive: true })
    }else if( this.state.ageFilterActive && this.state.keyword == ""){
      this.setState({ ageFilterActive: false })
    }
    return data;
  },
  render(){
    let { dropDown, keyword, ageFilterActive } = this.state;
    let columns = [
      {
        code: "name",
        label:
          <div ref="ageHeadContainer"
               className={`table-header-filter ${ dropDown ? "dropdown-on" : ""}`}>
            <div className="table-header-filter__title-wrapper"
                 onClick={this.controlDropdown} >
              <span className="table-header-filter__title" >Name</span>
              <Icon className={`table-header-filter__filter-icon ${ageFilterActive != '' ? "-active" : ""}` } type="filter"/>
            </div>
            { dropDown && <div className="table-header-filter__dropdown">
              <Input ref="input"
                     size="small"
                     value={this.state.keyword}
                     domProps={{
                       autoFocus: true,
                       onKeyDown: (e) => {
                         if(e.key == 'Enter') {
                           this.fetchData();
                         }
                       },
                     }}
                     trigger="onChange"
                     onChange={(v) => this.setState({ keyword: v })}
              />
              <Icon className="table-header-filter__input-search-icon"
                    type="search"
                    onClick={this.fetchData}
              />
            </div>}
        </div>,
      },
      {
        code: "age",
        label: "Age",
        sorter: (a,b) => a.age - b.age  //本地排序

      },
      {
        code: "address",
        label: "Address",
        filters: [
          {text: "New York", value: "New York"},
          {text: "London", value: "London"}
        ],
        onFilter: (value, record) => {
          return record.address.includes(value);
        }
      },
      {
        code: "favoriteSports",
        label: "FavoriteSports",
        filterDropdown: <ul className="dropdown-container">
          <li onClick={this.fetchData}>basketball</li>
          <li onClick={this.fetchData}>football</li>
        </ul>
      },
      {
        code: "sex",
        label: "Sex",
        sorter: true, //服务端排序
        sorterOrder: "ascend"
      }
    ];
    return <div className="custom-header-demo">
      <Table columns={columns}
             dataSource={data}
             showHeader={true}
             pagination={{pageSize: 3, total: 100, current: 2}}
             onChange={this.tableChangeHandler}/>
    </div>
  },
  tableChangeHandler(pagination, filters, sorter){   // 拿到页码，filter,sorter的信息 可以向后端发请求
    console.log(`pagination: ${pagination}, filters: , ${filters}, sorter: ${sorter}`);
    this.fetchData();
  },
  controlDropdown(){
    let { dropDown } = this.state;
    this.setState({ dropDown: !dropDown });
  }
});
export default <CustomHeader />;