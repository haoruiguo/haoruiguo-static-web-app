import React from 'react';

function App() {
  return <Page1></Page1>;
}

class TrackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {disabled: false};
  }
  render() {
    return (
      <button id='trackBtn' disabled={this.state.disabled} onClick={()=>{this.props.onClick(); this.setState({disabled: true})}}>Track Events</button>
    )
  }
}

class VideoButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showButton: true, showVideo: false};
  }
  onclick() {
    this.setState({ showVideo: true });
    this.setState({ showButton: false });
  }
  render() {
    return (
      <div>
        {this.state.showButton ? <button id="showVideoBtn" onClick={this.onclick.bind(this)}>Show Video</button> : null}
        {this.state.showVideo ? <YouTubeVideo id='m9WxF0Vq0TY' trackVideoSignal={this.props.trackVideoSignal}/> : null}
      </div>
    )
  }
}

class YouTubeVideo extends React.Component {
  constructor(props) {
    super(props);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
  }
  componentDidMount = () => {
    if (!window.YT) { // if the API is not loaded yet
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = this.loadVideo;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      this.loadVideo();
    }
  };

  loadVideo = () => {
    const { id } = this.props;
    this.player = new window.YT.Player(`piVideo`, {
      videoId: id,
      events: {
        onStateChange: this.onPlayerStateChange
      },
    });
  };

  onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        console.log("video playing");
        this.props.trackVideoSignal('piVideo')
      }
  }
  render = () => {
    return (
      <div>
        <div id={`piVideo`}/>
      </div>
    );
  };
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

function Page1() {
  var analytics = new window.MSEI.Analytics();
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");
  var testScenario = [];
  var ingestionKey = '';
  var testEnv = '';
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key === "testScenario") {
      testScenario.push(value);
      continue;
    }
    if (key === "ingestionKey") {
      ingestionKey = value;
      continue;
    }
    if (key === "testEnv") {
      testEnv = value;
      continue;
    }
    analytics.setProperty(key, value);
  }
  const config = {
    ingestionKey: ingestionKey,
    // endpointUrl: "https://pipe.int.trafficmanager.net/OneCollector/1.0/​​​​​​",
    autoCapture:{
      }
  }
  if (testEnv.startsWith("INT")){
    config.endpointUrl = "https://pipe.int.trafficmanager.net/OneCollector/1.0/​​​​​​";
  }

  if (testScenario.includes("3")) {
    config.autoCapture.click = true;
  }
  if (testScenario.includes("2")) {
    config.autoCapture.view = true;
  }
  
  analytics.initialize(config);

  if (testScenario.includes("1")) {
    trackEvent();
  }

  function trackEvent() {
    var count = 0;
    while (count < 100) {
      const event = {
        name: "e2e_test_signal",
        version: "1.0.0",
        properties: {
          "id": generateId("item_"),
          "item_model": "CoffeeMachine",
          "model_year": (2010 + count % 10).toString(),
          "cost": Math.random() * 100,
        }
      }
      
      analytics.trackEvent(event);
      count++;
    }
  } 
  
  function trackVideoSignal(videoName) {
    const event = {
      name: "video_playing_signal",
      version: "1.0.0",
      properties: {
        "id": generateId("item_"),
        "video_name": videoName,
      }
    }
    analytics.trackEvent(event);
  }

  function generateId(prefix) {
    return prefix + Math.floor(Math.round() * 1001).toString();
  }

  return (
    <div className="App">
      <TrackButton onClick={trackEvent} />
      <br/>
      <VideoButton trackVideoSignal={trackVideoSignal}/>
      <ImageButton/>
    </div>
  )
}

export default App;
