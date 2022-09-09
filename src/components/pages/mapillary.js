import React, {useState, useRef, useEffect} from 'react';
import {Viewer} from 'mapillary-js';
import * as d3 from 'd3';
// const container = document.createElement('div');
// container.style.width = '400px';
// container.style.height = '300px';
// document.body.appendChild(container);

// const viewer = new Viewer({
//   accessToken: 'MLY|5601141439945634|a93d0122bc05efd58fbd9c081cf82b8f',
//   container,
//   imageId: '498763468214164',
// });

// function myimageid() {
//   return '498763468214164';
// }

function RenderMapillary(props) {
  class ViewerComponent extends React.Component {
    constructor(props) {
      super(props);
      this.containerRef = React.createRef();
    }

    componentDidMount() {
      this.viewer = new Viewer({
        accessToken: this.props.accessToken,
        container: this.containerRef.current,
        imageId: this.props.imageId,
      });
    }

    componentWillUnmount() {
      if (this.viewer) {
        this.viewer.remove();
      }
    }

    render() {
      const imageId = '123456';
      return <div ref={this.containerRef} style={this.props.style} />;
    }
  }

  return (
    <ViewerComponent
      accessToken={'MLY|5601141439945634|a93d0122bc05efd58fbd9c081cf82b8f'}
      imageId={'498763468214164'}
      style={{width: '40%', height: '400px'}}
    />
  );
}

export default RenderMapillary;
//259103735961077