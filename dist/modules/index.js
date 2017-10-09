import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Spy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ids: [],
      targetIndices: {}
    };

    this.indicesInViewPort = [];
    this.wrapper = null;
    this.items = {};
    this.targets = [];
  }

  componentWillMount() {
    const { children } = this.props;
    const ids = [];
    const targetIndices = {};

    children.map((child, index) => {
      ids.push(child.props.id);
      targetIndices[child.props.id] = index;
      return null;
    });

    this.setState(() => {
      return { ids, targetIndices };
    });
  }

  componentDidMount() {
    const { onChange } = this.props;

    // INTERNAL LISTENERS
    this.wrapper.addEventListener('targetchange', this.hashchangeDispatcher.bind(), { passive: true });

    // EXTERNAL LISTENERS
    addEventListener('hashchange', e => {
      if (onChange) onChange(e);
    }, { passive: true });

    // Remapping items
    Object.keys(this.items).forEach(key => {
      this.targets.push(this.items[key]);
    });

    // Start scroll spy
    this.runSpy();
  }

  // SCROLL SPY FUNCTIONS
  onIntersectionChange(changes) {
    const oldTargetIndex = this.indicesInViewPort[0] || 0;

    for (let i = changes.length - 1; i >= 0; i--) {
      this.updateIndicesInViewPort(changes[i], oldTargetIndex);
    }

    if (this.indicesInViewPort.length === 0) {
      return;
    }

    if (oldTargetIndex === this.indicesInViewPort[0]) {
      return;
    }

    const event = new CustomEvent('targetchange', {
      detail: {
        newTarget: this.targets[this.indicesInViewPort[0]],
        oldTarget: this.targets[oldTargetIndex]
      }
    });

    this.wrapper.dispatchEvent(event);
  }

  updateIndicesInViewPort(change, oldTargetIndex) {
    const { targetIndices } = this.state;

    const index = targetIndices[change.target.id];

    if (change.intersectionRatio === 0) {
      const indexInViewPort = this.indicesInViewPort.indexOf(index);
      this.indicesInViewPort.splice(indexInViewPort, 1);
    } else if (index < oldTargetIndex) {
      this.indicesInViewPort.unshift(index);
    } else if (index > this.indicesInViewPort[this.indicesInViewPort.length - 1]) {
      this.indicesInViewPort.push(index);
    } else {
      this.indicesInViewPort.push(index);
      this.indicesInViewPort.sort();
    }
  }

  runSpy() {
    const { offset } = this.props;

    const observer = new IntersectionObserver(this.onIntersectionChange.bind(this), { rootMargin: offset });
    this.targets.forEach(observer.observe.bind(observer));
  }

  // EXPOSES NEW AND OLD URL & DISPATCH `HASH CHANGE EVENT`
  hashchangeDispatcher(e) {
    const hashchangeEvent = new Event('hashchange');

    const oldURL = new URL(location.href);
    if (e.detail.oldTarget) {
      oldURL.hash = `#${e.detail.oldTarget.id}`;
      hashchangeEvent.oldTargetID = e.detail.oldTarget.id;
    }
    hashchangeEvent.oldURL = oldURL.toString();
    if (e.detail.newTarget) {
      const newURL = new URL(location.href);
      newURL.hash = `#${e.detail.newTarget.id}`;
      hashchangeEvent.newURL = newURL.toString();
      hashchangeEvent.newID = e.detail.newTarget.id;
    }

    dispatchEvent(hashchangeEvent);
  }

  // ================ //
  // Render functions //
  // ================ //
  renderChildren() {
    const { children } = this.props;

    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        ref: el => this.items[child.props.id] = el
      });
    });
  }

  render() {
    const { elementType, className } = this.props;
    return React.createElement(elementType, {
      className,
      ref: wrapper => {
        this.wrapper = wrapper;
      }
    }, this.renderChildren());
    // return (
    //   <div className='spy' ref={ (wrapper) => { this.wrapper = wrapper; } }>
    //     { this.renderChildren() }
    //   </div>
    // );
  }
}

Spy.propTypes = {
  children: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  offset: PropTypes.string,
  className: PropTypes.string,
  elementType: PropTypes.string
};

Spy.defaultProps = {
  onChange: null,
  offset: '0px',
  elementType: 'div',
  className: 'spy'
};

export default Spy;