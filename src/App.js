import React from 'react';

function App() {
  return <ImageButton/>;
}


class ImageButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showButton: true, showImage: false};
  }
  onclick() {
    this.setState({showImage: true});
    this.setState({showButton: false});
  }
  render() {
    return (
      <div>
        {this.state.showButton ? <button id="showImgBtn" onClick={this.onclick.bind(this)}>Show Image</button> : null}
        {this.state.showImage ? <Image/> : null}
      </div>
    )
  }
}

function Image() {
  return (
    <a id="imageRef" href="https://dynamics.microsoft.com/en-us/ai/product-insights/">
      <img id="piImage" src='/image.png' alt="PI" width="960" height="540"/>
    </a>  
  )
}

export default App;
