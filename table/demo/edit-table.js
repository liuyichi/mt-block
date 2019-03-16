import React from 'react';
import Table from '../index';
import Input from '../../input';
import _ from 'lodash-compat';


const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    desc: "John Brown likes playing",
    sex: "boy"
  }
];



class EditTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      mode: "view",
      rows: data,
      initRows: _.cloneDeep(data)
    }
  }
  render(){
    let { mode, rows } = this.state;
    let columns = [
      {
        label: 'Name',
        code: 'name',
        width: "25%",
        format: (row, col, index) => <Input mode={ mode=="view" ? "view" : "default"}
                                            value={row[col.code]}
                                            onChange={ v => {
                                              row[col.code] = v;
                                              this.setState({ rows })
                                            }}/>
      },
      {
        label: 'Age',
        code: 'age',
        width: "25%",
        format: (row, col, index) => <Input mode={ mode=="view" ? "view" : "default"}
                                            value={row[col.code]}
                                            onChange={ v => {
                                              row[col.code] = v;
                                              this.setState({ rows })
                                            }}/>
      },
      {
        label: 'Address',
        code: 'address',
        width: "25%",
        format: (row, col, index) => <Input mode={ mode=="view" ? "view" : "default"}
                                            value={row[col.code]}
                                            onChange={ v => {
                                              row[col.code] = v;
                                              this.setState({ rows })
                                            }}/>
      },
      {
        label: "Operate",
        code: "operate",
        width: "25%",
        format: (row, col, index) => {
          if(mode == "view"){
            return <a onClick={() => {this.setState({ mode: "edit"})}}>edit</a>
          }else{
            return <div>
              <a onClick={this.saveHandler.bind(this)}>保存</a>
              <a style={{marginLeft: "10px"}} onClick={this.cancelHandler.bind(this)}>取消</a>
            </div>
          }

        }
      }
    ];
    return <Table columns={columns}
                  dataSource={rows}
                  pagination={false}/>
  }
  saveHandler(){
    this.setState({ mode: "view"})
  }
  cancelHandler(){
    this.setState({ rows: this.state.initRows, mode: "view"})
  }
};

export default <EditTable />;