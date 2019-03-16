import React from 'react';
import Select from '../index';

function getPopupContainer() {
  return document.querySelector('mt-workspace__detail');
}

let i = 0;
function onFetchData(filter, callback) {
  let delay = (i++) % 2 === 0 ? 3000 : 500;
  setTimeout(() => {
    callback([
      {"value": filter, "label": filter},
    ]);
  }, delay);
}

export default <div className="select-basic-demo">
  <div className="select-panel">
    <Select
      model={{idField: "value", showField: "label"}}
      noSearchIfNoKeyword={true}
      getPopupContainer={getPopupContainer()}
      onFetchData={onFetchData}
    />
  </div>
</div>;
