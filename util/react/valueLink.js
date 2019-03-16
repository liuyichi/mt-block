function valueLink(that, stateName, additionalChangeHandler) {
  additionalChangeHandler = additionalChangeHandler || noop;
  return {
    value: that.state[stateName],
    onChange: (e) => {
      that.setState({[stateName]: e.target.value});
      additionalChangeHandler.apply(null, arguments);
    }
  };
}

function noop() { }

export default valueLink;
