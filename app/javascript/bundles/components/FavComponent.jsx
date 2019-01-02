import React from "react"

class FavComponent extends React.Component {

  constructor(props) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = {
      // name: this.props.name
    };
  }
  // componentDidMount() {
  //   this.renderClampElements();
  // }

  // componentDidUpdate() {
  //   this.renderClampElements();
  // }

  // renderClampElements(){
  //   const nodelist = $("[class*='clamp-']");
  //   if (nodelist.length < 1) return;
  //   const regex = /clamp-(\d+)/;
  //   let lineno = 2;
  //   nodelist.each(function (index, element) {
  //     try {
  //       lineno = parseInt(regex.exec(element.className)[1]);
  //     } catch (e) {
  //       console.warn('Unable to determine the clamp line value. Make sure classes that clamp text obey the clamp-* rule');
  //     }
  //     $clamp(element,
  //       {
  //         'clamp': lineno,
  //         'useNativeClamp': true,
  //       });
  //   });
  // }

  render() {
    <div>
      {/*<FavComponent/>*/}
    </div>
    // return null
  }
}

export default FavComponent;