(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['react', 'react-dom'], factory);
  }else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('react'), require('react-dom'));
  }else {
    root.Loader = factory(root.React, root.ReactDOM);
  }

}(this, function(React, ReactDOM) {

  let Loader = React.createClass({
    propTypes: {
      children:        React.PropTypes.node,
      className:       React.PropTypes.string,
      component:       React.PropTypes.any,
      loaded:          React.PropTypes.bool,
      loadedClassName: React.PropTypes.string,
      options:         React.PropTypes.object,
      parentClassName: React.PropTypes.string,
    },

    getDefaultProps: function() {
      return {
        component: 'div',
        loadedClassName: 'loadedContent',
        parentClassName: 'loader loaderWithText',
      };
    },

    getInitialState: function() {
      return { loaded: false, options: {} };
    },

    componentDidMount: function() {
      this.updateState(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
      this.updateState(nextProps);
    },

    updateState: function(props) {
      props || (props = {});

      let loaded = this.state.loaded;
      let options = this.state.options;

      // Update loaded state, if supplied
      if ('loaded' in props) {
        loaded = !!props.loaded;
      }

      // Update spinner options, if supplied
      let allowedOptions = Object.keys(this.constructor.propTypes);
      allowedOptions.splice(allowedOptions.indexOf('loaded'), 1);
      allowedOptions.splice(allowedOptions.indexOf('options'), 1);

      // Allows passing options as either props or as an option object
      let propsOrObjectOptions = 'options' in props ? props.options : props;

      allowedOptions.forEach(function(key) {
        if (key in propsOrObjectOptions) {
          options[key] = propsOrObjectOptions[key];
        }
      });

      this.setState({ loaded: loaded, options: options }, this.spin);
    },

    spin: function() {
      let canUseDOM = !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
      );

      if (canUseDOM && !this.state.loaded) {
        let target =  ReactDOM.findDOMNode(this.refs.loader);

        // Clear out any other spinners from previous renders
        target.innerHTML = '';
      }
    },

    render: function() {
      let props, children;

      if (this.state.loaded) {
        props = { key: 'content', className: this.props.loadedClassName };
        children = this.props.children;
      }else {
        props = { key: 'loader', ref: 'loader', className: this.props.parentClassName };
      }

      return React.createElement(this.props.component, props, children);
    },
  });

  return Loader;

}));
