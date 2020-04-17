import React, { Component } from "react";
import "./style.scss";

class App extends Component {
  render() {
    return (
      <div className="app">
        <nav>Developed On: 18, Apri, 2020</nav>
        <main>
          <div className="main-nav">
            <div className="spinning-globe">
              <img src="/assets/globe.gif" alt="globe" />
            </div>
            <div className="logo">BHETGHAT LOGO HERE</div>
            <div className="nepal-flag">
              <img src="/assets/nepali_flag.gif" alt="flag" />
            </div>
          </div>
          <div className="main-body">
            <div className="heading">
              <p>Welcome to BhetGhat</p>
              मिलनको हाम्रो चौतारी
            </div>
            <div className="info">
              <p>Tell us about yourself</p>
              <div className="line">
                <hr />
              </div>
            </div>
            <form className="form">
              <div className="form-control">
                <label htmlFor="gender">Gender</label>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      type="radio"
                      name="gender"
                      id="gender"
                      value="female"
                    />
                    Female
                  </div>
                  <div className="input-group">
                    <input
                      type="radio"
                      name="gender"
                      id="gender"
                      value="male"
                    />
                    Male
                  </div>
                  <div className="input-group">
                    <input type="radio" name="gender" id="gender" value="na" />
                    Don't want to tell
                  </div>
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="ageGroup">Age Group</label>
                <div className="form-group">
                  <div className="input-group">
                    <input type="radio" name="ageGroup" value="1" /> Below 20
                    Years
                  </div>
                  <div className="input-group">
                    <input type="radio" name="ageGroup" value="2" /> 20 - 30
                    Years
                  </div>
                  <div className="input-group">
                    <input type="radio" name="ageGroup" value="3" /> 30 - 40
                    Years
                  </div>
                  <div className="input-group">
                    <input type="radio" name="ageGroup" value="4" /> 40+ Years
                  </div>
                </div>
              </div>
              <div className="form-control form-footer">
                <button className="chat">Let's Chat</button>
              </div>
              <div className="form-footer or-divider">OR</div>
              <div className="form-control form-footer">
                <button className="create">Create Account</button>
                <div className="help-text">
                  Your chats will be saved if you have an account.
                </div>
              </div>
            </form>
          </div>
          <div className="main-footer">
            If you have an account
            <div className="login">
              <button>Log In</button>
            </div>
          </div>
        </main>
        <footer></footer>
      </div>
    );
  }
}

export default App;
