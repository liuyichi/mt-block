import React from 'react';
import M from '../../util';
import { Draggable } from '../index';
import { Button } from '../../index';

class Demo extends M.BaseComponent {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      draggbleOptions: {
        data: new Array(100).fill(0).map((item, index) => `旧项目${index+1}`),
        options: {
          group: {
            name: 'list',
            pull: 'clone',
            // pull: (to, from, dragEl, event) => {
            //   return from.el.children.length > 1 || 'clone';
            // },
            // put: false,
            // revertClone: true,
          },
          // delay: 1000,
          // animation: 50000,
          // handle: '.drag-mark',
          // filter: '.not-allowed-move',
          // filter: (event, dragEl, instance) => {
          //   console.log('filter');
          //   return dragEl.classList.contains('not-allowed-move');
          // },
          sort: false,
          preventOnFilter: true,
          onFilter: (...args) => {
            console.log('on filter', args);
          },
          onStart: (...args) => {
            console.log('drag start', args);
          },
          onEnd: (...args) => {
            console.log('drag end', args);
          },
          onClone: (...args) => {
            console.log('clone', args);
          },
          // forceFallback: true,
          // fallbackOnBody: true,
          // fallbackTolerance: 10,
          // scroll: false,
          onChoose: (...args) => {
            console.log('choose', args);
          },
          onAdd: (...args) => {
            console.log('drop', args);
          },
          onUpdate: (...args) => {
            console.log('update into list', args);
          },
          onSort: (...args) => {
            console.log('sort', args);
          },
          onRemove: (...args) => {
            console.log('remove', args);
            if (args[2].lastPullMode != 'clone') {
              let { draggbleOptions: { data } } = this.state;
              let { oldIndex } = args[0];
              data.splice(oldIndex, 1);
              this.forceUpdate();
            }
          },
          onMove: (...args) => {
            console.log('move in list', args);
          },
          store: {
            /**
             * Get the order of elements. Called once during initialization.
             * @param   {Sortable}  sortable
             * @returns {Array}
             */
            get: function (sortable) {
              console.log('store get');
              var order = localStorage.getItem(sortable.options.group.name);
              return order ? order.split('|') : [];
            },

            /**
             * Save the order of elements. Called onEnd (when the item is dropped).
             * @param {Sortable}  sortable
             */
            set: function (sortable) {
              console.log('store set');
              var order = sortable.toArray();
              // console.log(order);
              // localStorage.setItem(sortable.options.group.name, order.join('|'));
            }
          },
        },
        format: (item, key, index, array) => {
          return (
            <div className={M.classNames("demo-draggable__item", {
              'not-allowed-move': index < 2,
            })}>
              <span className="drag-mark">::</span>
              {item}
            </div>
          );
        },
      },
      droppableOptions: {
        data: new Array(10).fill(0).map((item, index) => `新项目${index+1}`),
        options: {
          group: {
            name: 'list1',
            // put: true,
            put: ['list'],
            // put: (to, from, dragEl, event) => {
            //   return from.el.children.length > 2;
            // },
          },
          // animation: 5000,
          animation: 0,
          onAdd: (...args) => {
            console.log('drop into list1', args);
            let { droppableOptions: { data } } = this.state;
            let { from, newIndex, data: d } = args[0];
            data.splice(newIndex, 0, d);
            this.forceUpdate();
          },
          onMove: (...args) => {
            console.log('move in list1', args);
          },
          sort: true,
        },
        format: (item, key, index, array) => {
          return (
            <div key={index} className="demo-droppable__item">
              {item}
            </div>
          );
        },
      },
      allowMoved: true,
    })
  }
  render() {
    let { draggbleOptions, droppableOptions, allowMoved } = this.state;

    return (
      <div className="draggable-demo">
        <Draggable ref="draggable"
                  className="demo-draggable"
                  {...draggbleOptions} />
        <Draggable ref="droppable"
                  className="demo-droppable"
                  {...droppableOptions} />
        <section className="draggable-demo__operation">
          <Button type="primary" label="获取实例" onClick={this._onClick} />
          <Button label={`${allowMoved? '不' : ''}允许从第一个list中移出`} onClick={this._setOption} />
          <Button label="倒序" onClick={this._reverseOrder} />
        </section>
      </div>
    );
  }

  _onClick() {
    console.log(this.refs.draggable.getInstance());
  }

  _setOption() {
    let { allowMoved } = this.state;
    this.refs.draggable.setOption('group', { name: 'list', pull: !allowMoved });
    this.setState({ allowMoved: !allowMoved });
  }

  _reverseOrder() {
    let instance = this.refs.draggable;
    let order = instance.toArray();
    instance.sort(order.reverse());
  }
}

export default <Demo />;