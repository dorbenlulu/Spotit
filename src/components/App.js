import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./Header";
import Container from "./Container";

class App extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        loggedInUser:null,
                        userWantsToLogout:false,
                        refToExtractAllFollowings:null,
                }
        this.updateLoggedInUser = this.updateLoggedInUser.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleNewFollow = this.handleNewFollow.bind(this)
        this.setRefToExtractAllFollowings = this.setRefToExtractAllFollowings.bind(this)
        // this.handleUrlChange = this.handleUrlChange.bind(this)
        } //

        handleNewFollow() {
                this.setState({thereIsNewFollow:true})
                console.log("in App handleNewFollow")
                // Header told the db that we know follow new guy, 
                // hence I want to re-render container,
                // cause it'll extract my followings and will show the new images of folloing
        }

        handleLogout() {
                this.setState({
                        userWantsToLogout:true,
                        loggedInUser:null})
              fetch('/user/logout', {method:"GET", credentials:"include"})
        } // handleLogout
        
        updateLoggedInUser(loggedInUser) {
                this.setState({loggedInUser, userWantsToLogout:false})
        } // updateLoggedInUser

        // handleUrlChange() { // This method is used in order to make the Container rendered after the Header has changed the URL.
        //         console.log(`App.js: In handleUrlChange().`);
        //         this.setState(prevState => {prevState});
        // }

        setRefToExtractAllFollowings(refToExtractAllFollowings) {
                this.setState({refToExtractAllFollowings});
        }

        render() {
                console.log("in App Render")
                
                return (
                <Router>
                        <Header
                                loggedInUser={this.state.loggedInUser}
                                handleLogout={this.handleLogout}
                                handleUrlChanged={this.handleUrlChange}
                                handleNewFollow={this.handleNewFollow}
                                extractAllFollowings={this.state.refToExtractAllFollowings}
                         />
                        <Container
                         loggedInUser={this.state.loggedInUser}
                         updateLoggedInUser={this.updateLoggedInUser}

                         userWantsToLogout={this.state.userWantsToLogout}
                         
                         setRefToExtractAllFollowings={this.setRefToExtractAllFollowings}
                         />
                </Router>
           );
        } // render
} // class

export default App;