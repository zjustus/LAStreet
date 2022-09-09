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
      return <div ref={this.containerRef} style={this.props.style} />;
    }
}



    class Condition1 extends React.Component {
        render() {
            var test = ['145728107523175', '498763468214164'];
            function loopthrough() {
                test.forEach(function(i) {
                    return i
                })
            }
          return (
            <ViewerComponent
                accessToken={'MLY|5601141439945634|a93d0122bc05efd58fbd9c081cf82b8f'}
                imageId={test}
                style={{width: '100%', height: '400px'}}
            />
          );
        }
      }
      
      class Condition2 extends React.Component {
        render() {
          return (
            <ViewerComponent
                accessToken={'MLY|5601141439945634|a93d0122bc05efd58fbd9c081cf82b8f'}
                imageId={'259103735961077'}
                style={{width: '100%', height: '400px'}}
            />
          );
        }
      }
      
      class Update extends React.Component {
          constructor(props) {
              super(props);
              this.state = {
                index: 0,
                test: ['145728107523175', '179011504107194', '259103735961077']
              };
              this.handleClick = this.handleClick.bind(this);
          }
          
          handleClick() {
            // let i = this.state.index < this.state.test.length ? this.state.index += 1 : 0;
            let i = 0;
            this.setState({index: i});
            // this.setState(prevState => {
            //     return {index: prevState.index + 1}
            // });
          }

          handleClick1() {
            this.setState({index: 1});
          }

          handleClick2() {
            this.setState({index:2});
          }

          handleClick3() {
            this.setState({index:3});
          }
      
        render() {
        // var test = ['145728107523175', '498763468214164', '259103735961077'];
        //    const { index } = this.state;
           return (
               <div>
                   <button onClick={() => this.handleClick()}>Get Next Street View</button>
                   <button onClick={() => this.handleClick1()}>Click me: UCLA Royce Hall</button>
                   <button onClick={() => this.handleClick2()}>Click me: Sepulved Boulevard</button>
                   <button onClick={() => this.handleClick3()}>Click me: Forest Lawn Dr</button>
                  <br></br>Let the buttons be coordinates on the map
                   {/* Count: {this.state.index} */}
                   {/* {this.state.test.slice(0, this.state.index).map(function(i) { */}
                   {this.state.test.slice(this.state.index - 1, this.state.index).map(function(i) {
                    return (
                        <ViewerComponent
                            accessToken={'MLY|5601141439945634|a93d0122bc05efd58fbd9c081cf82b8f'}
                            imageId={i}
                            style={{width: '90%', height: '400px'}}
                        />
                    )
                   })}
               </div>
           )
        }
      }


export default Update;
//259103735961077